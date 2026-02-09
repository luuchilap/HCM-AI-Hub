# Project Patterns - VoiceInterview (justGrind)

This file documents architectural patterns, best practices, and conventions used in this project. Claude reads this file to maintain consistency and avoid anti-patterns.

**Last Updated**: 2025-12-05

---

## 🏗️ Architecture Patterns

### Convex Backend Patterns

#### Pattern: Custom Auth Wrappers (ALWAYS USE)
**Context**: All Convex functions must use custom wrappers from `convex/utils.ts`

**✅ Correct**:
```typescript
import { queryWithUser, mutationWithUser } from './utils';

export const getUserData = queryWithUser({
  handler: async (ctx, args) => {
    // ctx.userId is automatically available
    const data = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('userId'), ctx.userId))
      .first();
    return data;
  }
});
```

**❌ Wrong**:
```typescript
import { query } from './_generated/server';

export const getUserData = query({
  handler: async (ctx, args) => {
    // Missing userId injection, no auth
    const data = await ctx.db.query('users').collect();
    return data;
  }
});
```

**Why**: Security - ensures all functions require authentication and auto-inject `userId`.

---

#### Pattern: Async Background Processing
**Context**: AI operations (transcription, LLM calls) should run in background

**✅ Correct**:
```typescript
// Immediate response to user
const noteId = await ctx.db.insert('notes', {
  generatingTranscript: true,  // Loading state
  // ...
});

// Schedule background work (non-blocking)
await ctx.scheduler.runAfter(0, internal.whisper.chat, {
  fileUrl,
  id: noteId,
});

return noteId; // User sees loading UI immediately
```

**❌ Wrong**:
```typescript
// Blocking operation - user waits for AI
const transcript = await transcribeAudio(fileUrl);
const noteId = await ctx.db.insert('notes', {
  transcription: transcript,
});
return noteId; // 30+ second wait time
```

**Why**: Performance - keeps UI responsive while AI processes in background.

---

#### Pattern: Deployment Synchronization (CRITICAL)
**Context**: Convex has separate dev and production deployments

**✅ Correct**:
```bash
# Deploy to dev (during development)
npx convex dev --once

# Deploy to production (before push to main)
yes | npx convex deploy --prod

# Or use GitHub Action (automatic on push to main)
git push origin main
```

**❌ Wrong**:
```bash
# Only deploying to dev
npx convex dev --once
git push origin main
# Production users get "Could not find public function" errors
```

**Why**: Production breaks if functions exist in dev but not prod.
**Reference**: See `.github/workflows/convex-deploy.yml` and `claudedocs/CONVEX_DEPLOYMENT_SETUP.md`

---

### Next.js App Router Patterns

#### Pattern: Server-Side Data Preloading
**Context**: Optimize performance with server preloading + client reactivity

**✅ Correct**:
```typescript
// app/dashboard/page.tsx (Server Component)
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getAuthToken } from "@/app/auth";

export default async function Page() {
  const token = await getAuthToken();
  const preloadedData = await preloadQuery(
    api.notes.getNotes,
    {},
    { token }
  );

  return <ClientComponent preloadedData={preloadedData} />;
}

// app/dashboard/client.tsx (Client Component)
"use client";
import { usePreloadedQueryWithAuth } from "convex-helpers/react/sessions";

export default function ClientComponent({ preloadedData }) {
  const data = usePreloadedQueryWithAuth(preloadedData);
  // Data available immediately, then reactively updates
}
```

**❌ Wrong**:
```typescript
"use client";
export default function Page() {
  // Data loads after client-side hydration (slower)
  const data = useQuery(api.notes.getNotes);
  return <div>{data?.map(...)}</div>;
}
```

**Why**: Server preloading = faster initial load + SEO benefits + real-time updates after hydration.

---

#### Pattern: Client Boundary Placement
**Context**: Next.js 15 App Router requires explicit "use client" boundaries

**✅ Correct**:
```typescript
// app/feature/page.tsx (Server Component - default)
export default async function Page() {
  const data = await preloadQuery(...);
  return <InteractiveWidget preloadedData={data} />;
}

// components/InteractiveWidget.tsx (Client Component)
"use client";
export default function InteractiveWidget({ preloadedData }) {
  const [state, setState] = useState(...);
  // Interactive logic here
}
```

**❌ Wrong**:
```typescript
// app/feature/page.tsx
"use client"; // Entire page is client-side (loses server benefits)
export default function Page() {
  const [state, setState] = useState(...);
  const data = useQuery(...);
  // ...
}
```

**Why**: Keep server components as parents for data fetching, use client components only for interactivity.

---

### React Component Patterns

#### Pattern: Loading States for AI Operations
**Context**: Show skeleton loaders during AI processing

**✅ Correct**:
```typescript
export default function Component() {
  const note = useQuery(api.notes.getNote, { id });

  if (note?.generatingTranscript) {
    return <Skeleton className="h-20 w-full" />;
  }

  return <div>{note.transcription}</div>;
}
```

**Schema Support**:
```typescript
// convex/schema.ts
notes: defineTable({
  generatingTranscript: v.boolean(),
  generatingTitle: v.boolean(),
  generatingActionItems: v.boolean(),
  // ...
})
```

**Why**: Users see immediate feedback, not blank screens during AI processing.

---

## 🔒 Security Patterns

### Pattern: Row-Level Security
**Context**: Always filter queries by `userId` to prevent data leaks

**✅ Correct**:
```typescript
export const getNotes = queryWithUser({
  handler: async (ctx, args) => {
    const notes = await ctx.db
      .query('notes')
      .filter((q) => q.eq(q.field('userId'), ctx.userId))
      .collect();
    return notes;
  }
});
```

**❌ Wrong**:
```typescript
export const getNotes = query({
  handler: async (ctx, args) => {
    // Returns ALL users' notes (data leak!)
    const notes = await ctx.db.query('notes').collect();
    return notes;
  }
});
```

**Why**: Multi-tenant security - users should only see their own data.

---

### Pattern: Input Validation with Zod
**Context**: Use Convex's built-in Zod integration for type safety

**✅ Correct**:
```typescript
import { v } from 'convex/values';

export const createNote = mutationWithUser({
  args: {
    storageId: v.id('_storage'),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // args are validated at runtime
    const noteId = await ctx.db.insert('notes', {
      userId: ctx.userId,
      audioFileId: args.storageId,
      // ...
    });
    return noteId;
  }
});
```

**❌ Wrong**:
```typescript
export const createNote = mutation({
  handler: async (ctx, args: any) => {
    // No validation - security risk
    const noteId = await ctx.db.insert('notes', args);
    return noteId;
  }
});
```

**Why**: Runtime validation prevents malformed data and injection attacks.

---

## 🎨 UI/UX Patterns

### Pattern: Consistent Error Handling
**Context**: Show user-friendly errors, log technical details

**✅ Correct**:
```typescript
try {
  await processInterview(interviewId);
} catch (error) {
  console.error('Interview processing failed:', error);
  toast.error('Failed to process interview. Please try again.');
  // Optionally: Send to error tracking (Sentry, etc.)
}
```

**❌ Wrong**:
```typescript
try {
  await processInterview(interviewId);
} catch (error) {
  toast.error(error.message); // Shows technical error to user
}
```

**Why**: Users see actionable messages, developers get debugging info.

---

### Pattern: Optimistic Updates (When Applicable)
**Context**: Update UI immediately for better perceived performance

**✅ Correct** (for non-critical data):
```typescript
const markComplete = useMutation(api.todos.markComplete);

async function handleComplete(todoId: Id<"todos">) {
  // Optimistically update UI
  setLocalState(prev => prev.map(t =>
    t._id === todoId ? { ...t, completed: true } : t
  ));

  try {
    await markComplete({ todoId });
  } catch (error) {
    // Rollback on error
    setLocalState(prev => prev.map(t =>
      t._id === todoId ? { ...t, completed: false } : t
    ));
    toast.error('Failed to update');
  }
}
```

**❌ Wrong** (for critical data like payments):
```typescript
// Don't use optimistic updates for:
// - Payment processing
// - Credit deductions
// - User authentication
// - Data deletion
```

**Why**: Improves perceived speed for non-critical updates, but avoid for critical operations.

---

## 📦 Integration Patterns

### Pattern: LLM Structured Outputs (Instructor + Zod)
**Context**: Use Instructor library for type-safe LLM responses

**✅ Correct**:
```typescript
import { z } from "zod";

const NoteSchema = z.object({
  title: z.string().describe('Short descriptive title'),
  summary: z.string().max(500),
  actionItems: z.array(z.string()),
});

const extract = await client.chat.completions.create({
  model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
  response_model: { schema: NoteSchema, name: 'SummarizeNotes' },
  max_retries: 3,
  messages: [{ role: 'user', content: transcript }],
});

// Result is typed and validated
const { title, summary, actionItems } = extract;
```

**❌ Wrong**:
```typescript
const response = await client.chat.completions.create({
  model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
  messages: [{ role: 'user', content: 'Extract title and summary...' }],
});

// Untyped JSON parsing (brittle)
const data = JSON.parse(response.choices[0].message.content);
const title = data.title; // Might not exist
```

**Why**: Schema enforcement guarantees valid JSON with automatic retries.

---

### Pattern: Clerk Webhook Handling
**Context**: Clerk webhooks require explicit redirect handling

**✅ Correct**:
```typescript
// app/api/webhooks/clerk/route.ts
export async function POST(req: Request) {
  const evt = await verifyClerkWebhook(req);

  if (evt.type === 'user.created') {
    await handleUserCreated(evt.data);
    return new Response('OK', { status: 200 }); // Must return 200
  }

  // Explicit 307 for redirects if needed
  return new Response(null, {
    status: 307,
    headers: { 'Location': '/api/...' }
  });
}
```

**❌ Wrong**:
```typescript
export async function POST(req: Request) {
  const evt = await verifyClerkWebhook(req);
  // No response - webhook times out
  await handleUserCreated(evt.data);
}
```

**Why**: Clerk expects explicit 200 response, timeouts cause retries.
**Reference**: See `claudedocs/CLERK_WEBHOOK_307_FIX.md`

---

## 🧪 Testing Patterns

### Pattern: Test File Organization
**Context**: Keep tests separate from source code

**✅ Correct**:
```
tests/
├── components/
│   └── CreditBalance.test.tsx
├── convex/
│   └── subscription.test.ts
└── e2e/
    └── interview-flow.spec.ts
```

**❌ Wrong**:
```
app/
├── dashboard/
│   ├── page.tsx
│   └── page.test.tsx  // Don't co-locate in app/
convex/
├── subscription.ts
└── subscription.test.ts  // Don't co-locate in convex/
```

**Why**: Clean separation, easier CI/CD configuration.

---

## 🚀 Performance Patterns

### Pattern: Vector Search for Semantic Search
**Context**: Use Convex vector search for similarity queries

**✅ Correct**:
```typescript
// Generate embedding
const embedding = await togetherai.embeddings.create({
  input: [searchQuery],
  model: 'togethercomputer/m2-bert-80M-32k-retrieval',
});

// Vector similarity search (user-scoped)
const results = await ctx.vectorSearch('notes', 'by_embedding', {
  vector: embedding.data[0].embedding,
  limit: 16,
  filter: (q) => q.eq('userId', ctx.userId), // Security!
});
```

**Why**: 10x faster than full-text search for semantic similarity.

---

## 📝 Code Style Patterns

### Pattern: Naming Conventions
**Context**: Follow TypeScript/React conventions

**Convex Functions**: camelCase
```typescript
export const getNotes = queryWithUser({ ... });
export const createNote = mutationWithUser({ ... });
```

**React Components**: PascalCase
```typescript
export default function CreditBalance() { ... }
```

**Files**:
- Components: `CreditBalance.tsx`
- Convex: `subscription.ts`
- Tests: `subscription.test.ts`

**Database Fields**: camelCase
```typescript
{
  userId: string,
  audioFileId: Id<'_storage'>,
  createdAt: number,
}
```

---

## 🛠️ Development Workflow Patterns

### Pattern: Git Commit Messages
**Context**: Use conventional commits with descriptive messages

**✅ Correct**:
```
feat: add Convex production deployment safeguards

Implement dual-layer protection against missing Convex functions in production:
1. GitHub Actions workflow for automatic deployment on push to main
2. Enhanced /commit command with production deployment checks

Resolves production error: subscription:checkCredits not found
```

**❌ Wrong**:
```
update files
fix bug
changes
```

**Why**: Clear history, easier to track changes and generate changelogs.

---

## 📚 Documentation Patterns

### Pattern: Documentation Location
**Context**: Use appropriate directories for different doc types

**Claude-specific docs**: `claudedocs/`
```
claudedocs/
├── CONVEX_DEPLOYMENT_SETUP.md
├── CLERK_WEBHOOK_307_FIX.md
└── BASELINE_SEO_AUDIT.md
```

**General project docs**: `docs/`
```
docs/
├── CLAUDE.md
└── CLERK_HTTP_431_FIX.md
```

**Planning docs**: `thoughts/shared/plans/`
```
thoughts/shared/plans/
└── 2025-12-01-gdpr-privacy-compliance.md
```

**Why**: Clear separation between AI context, general docs, and planning artifacts.

---

## 🔄 Pattern Updates

When you discover new patterns or anti-patterns in this project, update this file:

```bash
# Document the pattern
/learn "Pattern description with context and examples"

# Commit the update
git add .claude/PATTERNS.md
git commit -m "docs: add [pattern name] to PATTERNS.md"
```

---

**Remember**: These patterns are project-specific. For global patterns across all projects, see `~/.claude/LEARNINGS.md`.
