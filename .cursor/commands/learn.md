# Learn - AI Mistake Documentation

You are tasked with systematically documenting AI mistakes and patterns to prevent repetition. This command updates institutional knowledge files (PATTERNS.md, GOTCHAS.md, LEARNINGS.md) with learned information.

**Philosophy**: Every mistake is a learning opportunity. Document it once, prevent it forever.

**Inspired by**: Principal engineer's ".context file" that prevents repeated errors by documenting mistakes systematically.

---

## Initial Response

When this command is invoked:

1. **Check if mistake description provided**:
   - If description provided: Process immediately
   - If no description: Prompt for details

2. **Default response** (no parameters):
```
I'll help document a mistake or learning to prevent repetition.

Please describe:
1. What went wrong? (or what pattern you discovered)
2. Why did it happen?
3. How to prevent it in the future?

I'll categorize this learning and add it to the appropriate knowledge file:
- Project-specific → .claude/GOTCHAS.md or .claude/PATTERNS.md
- Cross-project → ~/.claude/LEARNINGS.md

Example: /learn "Forgot to deploy Convex functions to production, causing runtime error"
```

3. **With parameter**:
```bash
/learn "Mistake or pattern description here"
```

---

## Process Steps

### Step 1: Analyze the Learning

1. **Read the mistake/pattern description**:
   - Understand what went wrong (or what pattern was discovered)
   - Identify root cause
   - Determine impact and severity

2. **Categorize the learning**:

   **Project-Specific (this codebase only)**:
   - References specific files, libraries, or frameworks used in this project
   - Only applicable to this tech stack (Convex, Next.js, Clerk, etc.)
   - Related to project-specific architecture or decisions
   → Add to `.claude/GOTCHAS.md` (mistakes) or `.claude/PATTERNS.md` (positive patterns)

   **Cross-Project (applicable everywhere)**:
   - Framework-agnostic principle
   - Applicable to any codebase or tech stack
   - General software engineering best practice
   → Add to `~/.claude/LEARNINGS.md`

3. **Determine entry type**:
   - **Gotcha**: A mistake, pitfall, or anti-pattern
   - **Pattern**: A positive pattern or best practice
   - **Learning**: A cross-project lesson or principle

### Step 2: Check for Duplicates

1. **Search existing knowledge files**:
   ```bash
   # Check if similar learning already exists
   grep -i "keyword" .claude/GOTCHAS.md
   grep -i "keyword" .claude/PATTERNS.md
   grep -i "keyword" ~/.claude/LEARNINGS.md
   ```

2. **If duplicate found**:
   ```
   I found a similar entry in [file]:

   ## [Existing Entry Title]
   [Existing content...]

   Would you like to:
   A) Update the existing entry with new information
   B) Create a separate entry (this is different enough)
   C) Skip (the existing entry covers this)
   ```

3. **If no duplicate**: Proceed to create new entry

### Step 3: Generate Learning Entry

Based on categorization, generate structured entry:

#### For .claude/GOTCHAS.md (Project Gotchas)

```markdown
### Gotcha: [Descriptive Title]
**Issue**: [What went wrong - one sentence]

**Symptoms**:
[How this issue manifests - error messages, unexpected behavior]

**Root Cause**: [Why this happened - technical explanation]

**Prevention**:
[How to avoid this in the future - specific steps]

**Solution**: [How to fix if it occurs again]

**When This Happens**: [Situations where this gotcha appears]

**Reference**: [Link to related docs, files, or patterns if applicable]
```

#### For .claude/PATTERNS.md (Project Patterns)

```markdown
### Pattern: [Pattern Name]
**Context**: [When to use this pattern]

**✅ Correct**:
```typescript
// Good example showing the pattern
```

**❌ Wrong**:
```typescript
// Bad example showing what to avoid
```

**Why**: [Explanation of benefits and reasoning]

**When This Applies**: [Situations where pattern is relevant]
```

#### For ~/.claude/LEARNINGS.md (Global Learnings)

```markdown
### Learning: [Learning Title]
**Context**: [General description of the scenario]

**Common Mistake**: [What developers typically do wrong]

**Prevention**:
[How to avoid this across any project]

**Example**:
```typescript
// Framework-agnostic example
```

**When This Happens**: [Common situations across projects]
```

### Step 4: Present Entry for Approval

Show the user the generated entry:

```
I've categorized this as a [project gotcha/pattern/global learning].

I'll add this to [.claude/GOTCHAS.md / .claude/PATTERNS.md / ~/.claude/LEARNINGS.md]:

---
[Generated entry content]
---

Does this accurately capture the learning?
- A) Yes, add it
- B) No, let me revise the description
- C) Change category (should be in different file)
```

### Step 5: Update Knowledge File

1. **Add entry to appropriate file**:
   - Append to existing section (or create new section if needed)
   - Maintain alphabetical or chronological order
   - Ensure formatting consistency

2. **Commit the change**:
   ```bash
   git add [file]
   git commit -m "docs: add [learning title] to [file]

   Documented [brief description of learning].
   Prevents [what this prevents in the future]."
   ```

3. **Confirm to user**:
   ```
   ✅ Learning documented successfully!

   Added to: [file]
   Section: [section name]
   Commit: [commit hash]

   This knowledge will be referenced in future sessions to prevent repetition.
   ```

---

## Example Learning Entries

### Example 1: Project-Specific Gotcha

**User**: `/learn "Forgot to deploy Convex functions to production, causing 'Could not find public function' error"`

**Generated Entry** (.claude/GOTCHAS.md):
```markdown
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
1. Manual: Always run BOTH before pushing to main:
   ```bash
   npx convex dev --once  # Deploy to dev
   yes | npx convex deploy  # Deploy to prod
   ```

2. Automated: GitHub Action deploys to prod on push to main

**Solution**: Deploy missing functions to prod immediately:
```bash
yes | npx convex deploy
```

**When This Happens**:
- Adding new Convex queries/mutations/actions
- Modifying schema (schema.ts)
- Creating new internal functions

**Reference**: See `claudedocs/CONVEX_DEPLOYMENT_SETUP.md`
```

---

### Example 2: Positive Pattern

**User**: `/learn "Using server-side preloading with usePreloadedQueryWithAuth gives both speed and real-time updates"`

**Generated Entry** (.claude/PATTERNS.md):
```markdown
### Pattern: Server-Side Data Preloading
**Context**: Optimize performance with server preloading + client reactivity

**✅ Correct**:
```typescript
// app/dashboard/page.tsx (Server Component)
export default async function Page() {
  const token = await getAuthToken();
  const preloadedData = await preloadQuery(
    api.notes.getNotes,
    {},
    { token }
  );
  return <ClientComponent preloadedData={preloadedData} />;
}

// Client Component
"use client";
export default function ClientComponent({ preloadedData }) {
  const data = usePreloadedQueryWithAuth(preloadedData);
  // Data available immediately, then reactively updates
}
```

**❌ Wrong**:
```typescript
"use client";
export default function Page() {
  const data = useQuery(api.notes.getNotes);
  // Data loads after client-side hydration (slower)
}
```

**Why**: Server preloading = faster initial load + SEO benefits + real-time updates after hydration.

**When This Applies**: Any page displaying user-specific data with Convex.
```

---

### Example 3: Global Learning

**User**: `/learn "Always check deployment targets - many platforms have separate dev/prod environments"`

**Generated Entry** (~/.claude/LEARNINGS.md):
```markdown
### Learning: Always Check Deployment Targets
**Context**: Many cloud platforms have separate dev/staging/prod environments.

**Common Mistake**: Deploying to dev but forgetting production, causing "function not found" errors.

**Prevention**:
1. Always verify which environment you're deploying to
2. Use CI/CD (GitHub Actions) to auto-deploy to prod on merge to main
3. Create deployment checklists in project documentation

**Examples Across Platforms**:
- **Convex**: `npx convex dev` vs `npx convex deploy`
- **Vercel**: Preview deploys vs production deploys
- **AWS Lambda**: Dev stage vs prod stage
- **Firebase**: Separate projects for dev/prod

**When This Happens**: Adding new backend functions, API endpoints, or database schema changes.
```

---

## Integration with Other Commands

### With /commit Command

The `/commit` command now prompts for learnings after creating commits:

```bash
/commit
# Commits created successfully

💡 Did I make any mistakes during this session that should be documented?
   Use /learn [description] to add to institutional knowledge.
```

This encourages systematic documentation after every session.

### With /vibe_audit Command

`/vibe_audit` identifies patterns that should be documented:

```bash
/vibe_audit project --period weekly
# Audit complete

📚 Learning Opportunities:
- New pattern discovered: [pattern]
- Anti-pattern to avoid: [anti-pattern]

Use /learn to document these findings:
  /learn "[pattern description]"
```

### With /test_first Command

`/test_first` can reveal testing patterns worth documenting:

```bash
/test_first feature-plan.md
# Tests generated

💡 New testing pattern used: [pattern]
   Consider documenting with /learn if this should be standard.
```

---

## Smart Categorization Guide

To help determine where a learning should go:

### → .claude/GOTCHAS.md
- Mentions specific project files or frameworks (Convex, Clerk, Lemon Squeezy)
- Only happens in this tech stack
- Related to project architecture decisions
- Examples:
  - "Convex deployment mismatch"
  - "Clerk webhook 307 redirects"
  - "Lemon Squeezy test vs prod API keys"

### → .claude/PATTERNS.md
- Positive pattern used in this project
- Shows how to structure code in this stack
- Demonstrates best practices with project-specific examples
- Examples:
  - "Server-side preloading with Convex"
  - "Custom auth wrappers for queries"
  - "Async background processing with scheduler"

### → ~/.claude/LEARNINGS.md
- Applies to any programming language or framework
- General software engineering principle
- Could happen in React, Python, Go, etc.
- Examples:
  - "Always check deployment targets"
  - "Test behavior, not implementation"
  - "Row-level security is non-negotiable"

**Rule of thumb**: If you can explain it without mentioning this project's specific tech stack, it goes in LEARNINGS.md.

---

## Bulk Learning Documentation

For multiple learnings from a session:

```bash
# Document multiple learnings at once
/learn "
1. Forgot to deploy Convex to prod
2. Missing error handling in webhook
3. Large component should be split
"

# Claude will:
# - Parse each learning separately
# - Categorize each one
# - Generate entries for all
# - Show all for approval
# - Commit all together
```

---

## Learning Statistics

Track learning accumulation over time:

```bash
# View learning stats
wc -l .claude/GOTCHAS.md .claude/PATTERNS.md ~/.claude/LEARNINGS.md

# Search for specific topic
grep -i "webhook" .claude/GOTCHAS.md .claude/PATTERNS.md

# See recent learnings
git log --oneline --grep="docs: add" -- .claude/GOTCHAS.md
```

---

## Success Criteria

The `/learn` command is successful when:

1. ✅ **Mistakes are documented systematically** after every session
2. ✅ **Knowledge files grow over time** (more patterns, fewer repeated mistakes)
3. ✅ **Claude stops repeating documented mistakes** (reads files at session start)
4. ✅ **Team members reference knowledge files** (living documentation)
5. ✅ **Categorization is accurate** (right file for right learning)

---

## Important Notes

### Make It a Habit
- Document learnings **immediately** when they occur
- Don't wait until end of day/week (you'll forget details)
- Use `/commit` prompt as reminder
- Low friction: single command with description

### Focus on Prevention
- Every entry should explain how to **prevent** the issue
- Not just "what went wrong" but "how to avoid next time"
- Include code examples where relevant
- Link to related documentation

### Keep It Actionable
- Specific, not vague ("Always deploy to prod" not "Remember deployment")
- Concrete examples, not abstract principles
- File references where applicable
- Commands to run, patterns to follow

### Avoid Duplication
- Search before adding new entry
- Update existing entries if similar
- Consolidate related learnings
- Keep knowledge files focused and scannable

---

## Example Session with /learn

**Scenario**: You forgot to add error handling to a webhook, and it caused retries.

```bash
User: /learn "Webhook handler missing try-catch caused Lemon Squeezy to retry 5 times"

Claude: I'll help document this learning.

Analyzing...
- Category: Project-specific gotcha (Lemon Squeezy webhooks)
- File: .claude/GOTCHAS.md
- Severity: Medium (causes retries, but not data loss)

I'll add this to .claude/GOTCHAS.md:

---
### Gotcha: Missing Error Handling in Webhook Handlers
**Issue**: Webhook handlers without try-catch blocks don't return proper status codes, causing external services to retry.

**Symptoms**:
- Webhook marked as "Failed" in Lemon Squeezy dashboard
- Same webhook received 5+ times
- Logs show successful processing, but still retrying

**Root Cause**: Unhandled errors result in no HTTP response or wrong status code.

**Prevention**:
```typescript
export async function POST(req: Request) {
  try {
    const data = await req.json();
    await processWebhook(data);
    return new Response('OK', { status: 200 }); // Explicit success
  } catch (error) {
    console.error('Webhook failed:', error);
    return new Response('Error', { status: 500 }); // Explicit failure
  }
}
```

**Solution**: Add try-catch to all webhook handlers, always return explicit status codes.

**When This Happens**: Any webhook integration (Stripe, Clerk, GitHub, Lemon Squeezy).

**Reference**: See `.claude/PATTERNS.md` - "Pattern: Webhook Error Handling"
---

Does this accurately capture the learning?

User: Yes

Claude: ✅ Learning documented successfully!

Added to: .claude/GOTCHAS.md
Section: Integration Gotchas
Commit: a1b2c3d "docs: add webhook error handling gotcha"

This knowledge will be referenced in future sessions to prevent repetition.

Next time you work with webhooks, I'll remember to add proper error handling!
```

---

## Relationship to Other Commands

- **Triggered by**: `/commit` (post-commit learning prompt)
- **Informed by**: `/vibe_audit` (pattern discoveries)
- **Referenced by**: All commands (knowledge files read at session start)
- **Feeds into**: Future development (prevents repeated mistakes)

---

**Remember**: Every mistake is a learning opportunity. Document it once with `/learn`, prevent it forever. The institutional knowledge system only works if it's continuously updated with real experiences.
