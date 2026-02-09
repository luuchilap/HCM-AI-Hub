# Project Gotchas - VoiceInterview (justGrind)

This file documents common mistakes, edge cases, and pitfalls specific to this project. Claude reads this file to avoid repeating known issues.

**Last Updated**: 2025-12-05

---

## 🚨 Deployment Gotchas

### Gotcha: Convex Dev/Prod Deployment Mismatch
**Issue**: Functions deployed to dev but not prod, causing "Could not find public function" errors in production.

**Symptoms**:
```
Error: Could not find public function for 'subscription:checkCredits'.
Did you forget to run `npx convex dev` or `npx convex deploy`?
```

**Root Cause**: Convex has separate deployments:
- Dev: `dazzling-chameleon-46` (development)
- Prod: `precise-albatross-969` (production)

Running `npx convex dev` only deploys to dev, not prod.

**Prevention**:
1. **Manual**: Always run BOTH before pushing to main:
   ```bash
   npx convex dev --once  # Deploy to dev
   yes | npx convex deploy --prod  # Deploy to prod
   ```

2. **Automated**: GitHub Action deploys to prod on push to main (see `.github/workflows/convex-deploy.yml`)

**Solution**: Deploy missing functions to prod immediately:
```bash
yes | npx convex deploy --prod
```

**Reference**: See `claudedocs/CONVEX_DEPLOYMENT_SETUP.md` and `DEPLOY_TO_PRODUCTION_NOW.md`

**When This Happens**:
- Adding new Convex queries/mutations/actions
- Modifying schema (schema.ts)
- Changing function signatures
- Creating new internal functions

---

### Gotcha: Generated Files Show as Modified
**Issue**: `convex/_generated/*.d.ts` and `*.js` files always show as modified in git status.

**Symptoms**:
```bash
git status
# modified:   convex/_generated/api.d.ts
# modified:   convex/_generated/server.d.ts
```

**Root Cause**: Convex regenerates these files during `npx convex dev`, and they differ slightly between machines.

**Prevention**: Add to `.gitignore`:
```gitignore
convex/_generated/
```

**Current State**: Currently tracked in git (inconsistent), should be ignored.

**Action**: Add to `.gitignore` and remove from tracking:
```bash
echo "convex/_generated/" >> .gitignore
git rm --cached -r convex/_generated/
git commit -m "chore: ignore Convex generated files"
```

---

## 🔒 Authentication Gotchas

### Gotcha: Clerk Webhook 307 Redirect Loop
**Issue**: Clerk webhooks fail with 307 redirects, causing user sync issues.

**Symptoms**:
- Webhook shows "Failed" in Clerk dashboard
- Users created in Clerk but not in Convex database
- HTTP 307 Temporary Redirect errors in logs

**Root Cause**: Next.js middleware redirects missing trailing slashes, but Clerk webhooks don't follow redirects.

**Prevention**: Always return explicit 200 status in webhook handlers:
```typescript
// app/api/webhooks/clerk/route.ts
export async function POST(req: Request) {
  const evt = await verifyClerkWebhook(req);

  if (evt.type === 'user.created') {
    await handleUserCreated(evt.data);
    return new Response('OK', { status: 200 }); // MUST return 200
  }

  return new Response('OK', { status: 200 });
}
```

**Solution**: Never rely on implicit responses or redirects in webhook routes.

**Reference**: See `claudedocs/CLERK_WEBHOOK_307_FIX.md` and `claudedocs/CLERK_WEBHOOK_SOLUTION.md`

---

### Gotcha: Missing Auth Token in Server Components
**Issue**: Server components can't access Clerk session without explicit token fetching.

**Symptoms**:
```typescript
// This doesn't work in Server Components
const { userId } = useAuth(); // Error: useAuth is client-side only
```

**Root Cause**: Clerk hooks (`useAuth`, `useUser`) are client-side only.

**Prevention**: Use `getAuthToken()` helper in Server Components:
```typescript
// app/dashboard/page.tsx (Server Component)
import { getAuthToken } from "@/app/auth";

export default async function Page() {
  const token = await getAuthToken(); // ✅ Correct

  const preloadedData = await preloadQuery(
    api.notes.getNotes,
    {},
    { token } // Pass token to Convex
  );

  return <ClientComponent preloadedData={preloadedData} />;
}
```

**When This Happens**: Any Server Component that needs to fetch user-specific data from Convex.

---

## ⚡ Performance Gotchas

### Gotcha: Audio File Storage Bloat
**Issue**: Storing audio files permanently consumes large amounts of Convex storage.

**Symptoms**:
- Convex storage usage grows rapidly
- Costs increase with file retention
- Users rarely re-listen to recordings

**Root Cause**: Audio files are large (5-10MB per interview), and Convex charges for storage.

**Prevention**: Delete audio files after transcription:
```typescript
// convex/whisper.ts
const transcription = await transcribeAudio(fileUrl);

// Update note with transcription
await ctx.db.patch(noteId, {
  transcription,
  generatingTranscript: false,
});

// Delete audio file (saves storage)
await ctx.storage.delete(audioFileId);
```

**Trade-off**: Users can't re-listen to original audio. Consider keeping for Pro tier.

**Current State**: Audio files ARE deleted after transcription in this project.

---

### Gotcha: N+1 Query Pattern in React Components
**Issue**: Components making separate queries for related data instead of joining.

**Symptoms**:
```typescript
// ❌ Bad: N+1 queries
function InterviewList() {
  const interviews = useQuery(api.interviews.list);

  return interviews?.map(interview => {
    const questions = useQuery(api.questions.getByInterview, { interviewId: interview._id });
    // Separate query per interview!
    return <InterviewCard interview={interview} questions={questions} />;
  });
}
```

**Root Cause**: Convex doesn't have SQL-style joins, so developers default to multiple queries.

**Prevention**: Fetch related data in single Convex function:
```typescript
// ✅ Good: Single query with related data
// convex/interviews.ts
export const listWithQuestions = queryWithUser({
  handler: async (ctx, args) => {
    const interviews = await ctx.db
      .query('interviews')
      .filter((q) => q.eq(q.field('userId'), ctx.userId))
      .collect();

    return Promise.all(
      interviews.map(async (interview) => {
        const questions = await ctx.db
          .query('questions')
          .filter((q) => q.eq(q.field('interviewId'), interview._id))
          .collect();

        return { ...interview, questions };
      })
    );
  }
});

// Component
function InterviewList() {
  const interviews = useQuery(api.interviews.listWithQuestions);
  return interviews?.map(interview => (
    <InterviewCard interview={interview} questions={interview.questions} />
  ));
}
```

**When This Happens**: Any list view with related data (interviews + questions, users + profiles, orders + items).

---

## 🎨 UI/UX Gotchas

### Gotcha: Skeleton Loader Missing for AI Operations
**Issue**: Users see blank screens during AI processing (transcription, LLM calls).

**Symptoms**:
- Component renders empty state while `generatingTranscript: true`
- Users think app is broken

**Root Cause**: Not checking loading flags before rendering content.

**Prevention**: Always check loading states:
```typescript
function NoteDetail({ noteId }: { noteId: Id<"notes"> }) {
  const note = useQuery(api.notes.getNote, { noteId });

  // ✅ Check loading states
  if (!note) return <Skeleton className="h-40 w-full" />;

  if (note.generatingTranscript) {
    return <Skeleton className="h-20 w-full" />;
  }

  if (note.generatingTitle) {
    return <div>
      <Skeleton className="h-6 w-48" />
      <div>{note.transcription}</div>
    </div>;
  }

  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.transcription}</p>
    </div>
  );
}
```

**Loading Flags in Schema**:
```typescript
notes: defineTable({
  generatingTranscript: v.boolean(),
  generatingTitle: v.boolean(),
  generatingActionItems: v.boolean(),
  // ...
})
```

---

### Gotcha: Toast Errors Showing Technical Details
**Issue**: Users see raw error messages meant for developers.

**Symptoms**:
```typescript
toast.error("Error: CONVEX_0: Document with ID '...' not found");
```

**Root Cause**: Passing error objects directly to toast instead of user-friendly messages.

**Prevention**: Always wrap in user-friendly messages:
```typescript
// ❌ Bad
try {
  await deleteInterview({ id });
} catch (error) {
  toast.error(error.message); // Technical error to user
}

// ✅ Good
try {
  await deleteInterview({ id });
  toast.success('Interview deleted successfully');
} catch (error) {
  console.error('Delete failed:', error); // Log technical details
  toast.error('Failed to delete interview. Please try again.'); // User-friendly message
}
```

---

## 🔧 Development Gotchas

### Gotcha: Environment Variables Not Loaded in Convex
**Issue**: Convex functions can't access `.env.local` variables.

**Symptoms**:
```typescript
const apiKey = process.env.TOGETHER_API_KEY; // undefined in Convex functions
```

**Root Cause**: Convex runs in cloud, not in Next.js runtime. Environment variables must be set in Convex dashboard.

**Prevention**: Use Convex dashboard for backend environment variables:
1. Go to https://dashboard.convex.dev/
2. Select deployment (`precise-albatross-969` for prod)
3. Settings → Environment Variables
4. Add variables there

**Environment Variable Location**:
- **Next.js client-side**: `.env.local` with `NEXT_PUBLIC_*` prefix
- **Next.js server-side**: `.env.local` (no prefix)
- **Convex functions**: Convex dashboard environment variables

```bash
# .env.local (Next.js only)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CONVEX_URL=https://...

# Convex Dashboard (for Convex functions)
# CLERK_ISSUER_URL=https://...
# TOGETHER_API_KEY=...
```

---

### Gotcha: TypeScript Errors After Schema Changes
**Issue**: TypeScript shows errors after updating `convex/schema.ts`.

**Symptoms**:
```typescript
Type 'string' is not assignable to type 'Id<"notes">'.
```

**Root Cause**: Convex hasn't regenerated type definitions in `convex/_generated/`.

**Prevention**: Restart Convex dev server after schema changes:
```bash
# Stop current dev server (Ctrl+C)
npm run dev
# OR manually
npx convex dev
```

**Alternative**: Run once to regenerate types:
```bash
npx convex dev --once
```

**When This Happens**:
- Adding new tables to schema
- Modifying table fields
- Changing field types
- Adding/removing indexes

---

## 📦 Integration Gotchas

### Gotcha: Together.ai Rate Limits
**Issue**: Together.ai API calls fail with 429 status during high usage.

**Symptoms**:
```
Error: Rate limit exceeded. Try again in X seconds.
```

**Root Cause**: Free/starter tier has rate limits on API calls.

**Prevention**: Implement retry logic with exponential backoff:
```typescript
async function callTogetherAI(prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await together.chat.completions.create({
        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        messages: [{ role: 'user', content: prompt }],
      });
    } catch (error) {
      if (error.status === 429 && i < retries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}
```

**Current State**: Basic retry logic exists in some functions, not all.

---

### Gotcha: Lemon Squeezy Test Mode vs Production
**Issue**: Payments work in test mode but fail in production.

**Symptoms**:
- Test purchases work fine
- Production purchases don't trigger webhooks
- Credits not added to user accounts

**Root Cause**: Different API keys and variant IDs for test vs production.

**Prevention**: Use environment-specific configuration:
```typescript
const LEMON_SQUEEZY_CONFIG = {
  test: {
    apiKey: process.env.LEMON_SQUEEZY_TEST_API_KEY,
    variantId: '1116731', // Test variant
  },
  production: {
    apiKey: process.env.LEMON_SQUEEZY_API_KEY,
    variantId: '1234567', // Production variant
  }
};

const config = LEMON_SQUEEZY_CONFIG[process.env.NODE_ENV === 'production' ? 'production' : 'test'];
```

**Reference**: See payment integration code in `app/api/lemon-squeezy/` and `convex/subscription.ts`.

---

## 🧪 Testing Gotchas

### Gotcha: Tests Don't Have Access to Convex Functions
**Issue**: Unit tests fail because Convex client isn't initialized.

**Symptoms**:
```typescript
TypeError: Cannot read property 'query' of undefined
```

**Root Cause**: Tests run in Node.js, not browser, and don't have Convex client setup.

**Prevention**: Mock Convex functions in tests:
```typescript
// tests/mocks/convex.ts
import { vi } from 'vitest';

export const mockConvexQuery = vi.fn();
export const mockConvexMutation = vi.fn();

vi.mock('convex/react', () => ({
  useQuery: mockConvexQuery,
  useMutation: mockConvexMutation,
}));
```

**Alternative**: Use Convex test helpers (if available) for integration tests.

**Current State**: No automated tests exist yet. This will be relevant when implementing test-first workflow.

---

## 🔄 Migration Gotchas

### Gotcha: Schema Migrations Require Careful Ordering
**Issue**: Changing schema breaks existing data or deployments.

**Symptoms**:
- Old data doesn't match new schema
- Queries fail with type errors
- Deployment fails validation

**Root Cause**: Convex validates schema against existing data.

**Prevention**: Use migration scripts in `convex/migrations/`:
```typescript
// convex/migrations/addNewField.ts
import { internalMutation } from '../_generated/server';

export default internalMutation(async (ctx) => {
  const notes = await ctx.db.query('notes').collect();

  for (const note of notes) {
    await ctx.db.patch(note._id, {
      newField: 'default value', // Add field to existing records
    });
  }
});
```

**Steps**:
1. Create migration script
2. Run migration: `npx convex run migrations/addNewField`
3. Update schema.ts with new field
4. Deploy: `npx convex dev --once`

**Examples**: See `convex/migrations/migrateQuestions.ts` and `convex/migrations/add5NewQuestions.ts`.

---

## 📝 Documentation Gotchas

### Gotcha: Outdated Documentation After Rapid Changes
**Issue**: README or CLAUDE.md doesn't reflect current codebase.

**Symptoms**:
- Documentation mentions removed features
- Setup instructions reference old environment variables
- Architecture diagrams show old structure

**Root Cause**: Docs not updated during feature development.

**Prevention**: Update docs in same commit as code changes:
```bash
# Make code changes
# Update relevant docs
git add feature.ts docs/CLAUDE.md
git commit -m "feat: add feature X

Updated CLAUDE.md to reflect new architecture."
```

**Regular Review**: Run `/vibe_audit` weekly to catch documentation drift.

---

## 🛠️ Gotcha Updates

When you encounter new gotchas in this project, document them here:

```bash
# Document the gotcha
/learn "Gotcha description with symptoms, root cause, and prevention"

# Commit the update
git add .claude/GOTCHAS.md
git commit -m "docs: add [gotcha name] to GOTCHAS.md"
```

---

**Remember**: These gotchas are project-specific. For global gotchas across all projects, see `~/.claude/LEARNINGS.md`.
