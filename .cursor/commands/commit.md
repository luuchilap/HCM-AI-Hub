# Commit Changes

You are tasked with creating git commits for the changes made during this session.

## Process:

1. **Think about what changed:**
   - Review the conversation history and understand what was accomplished
   - Run `git status` to see current changes
   - Run `git diff` to understand the modifications
   - Consider whether changes should be one commit or multiple logical commits

2. **Plan your commit(s):**
   - Identify which files belong together
   - Draft clear, descriptive commit messages
   - Use imperative mood in commit messages
   - Focus on why the changes were made, not just what

3. **Present your plan to the user:**
   - List the files you plan to add for each commit
   - Show the commit message(s) you'll use
   - Ask: "I plan to create [N] commit(s) with these changes. Shall I proceed?"

4. **Execute upon confirmation:**
   - Use `git add` with specific files (never use `-A` or `.`)
   - Create commits with your planned messages
   - Show the result with `git log --oneline -n [number]`

5. **Push to remote GitHub repository:**
   - After all commits are created, push to remote: `git push origin main`
   - Verify push succeeded and show confirmation
   - If push fails (e.g., rejected), inform user and suggest `git pull --rebase` first

## Important:
- **NEVER add co-author information or Claude attribution**
- Commits should be authored solely by the user
- Do not include any "Generated with Claude" messages
- Do not add "Co-Authored-By" lines
- Write commit messages as if the user wrote them

## Remember:
- You have the full context of what was done in this session
- Group related changes together
- Keep commits focused and atomic when possible
- The user trusts your judgment - they asked you to commit
- **Always push to `origin main` after committing** - this is part of the standard workflow

## ⚠️ CRITICAL: Convex Deployment Check
**Before committing, if ANY Convex functions were added or modified:**

1. **Check for Convex changes:**
   - Look for changes in `convex/` directory
   - New queries, mutations, actions, or schema changes

2. **Deploy Convex functions to BOTH environments:**
   - **Development**: Run `npx convex dev --once` to deploy to dev
   - **Production**: Run `npx convex deploy --prod` (or manually via dashboard)
   - Wait for "Convex functions ready!" confirmation for both
   - This prevents "Could not find public function" errors in production

3. **Deployment Strategy:**
   - **Option A (Recommended)**: Ask user to deploy to production
   - **Option B**: If user confirms, deploy automatically with `yes | npx convex deploy --prod`
   - Never deploy to production without explicit user confirmation

4. **Reminder message:**
   - If Convex changes detected, include in your plan:
   - "⚠️ Detected Convex function changes in [files]"
   - "📦 Deploying to dev with `npx convex dev --once`"
   - "🚀 User confirmation needed: Deploy to production? (yes | npx convex deploy --prod)"
   - Show deployment success before proceeding

**Why this matters:**
- Frontend code may reference new Convex functions immediately
- Un-deployed functions cause runtime errors: "Could not find public function"
- Dev and prod environments must stay in sync
- Production deployment requires explicit confirmation to avoid accidents

---

## 💡 Post-Commit Learning Prompt

**After successfully creating commits:**

Always prompt the user to document learnings from the session:

```
✅ Commits created successfully!

💡 Did I make any mistakes during this session that should be documented?

Examples of learnings worth documenting:
- Errors or bugs I encountered and fixed
- Patterns I discovered that work well
- Gotchas or pitfalls I found
- Best practices I should remember

Use /learn "[description]" to add to institutional knowledge.

This helps prevent repeating the same mistakes in future sessions.
```

**When to emphasize this prompt:**
- After fixing bugs or errors during implementation
- After trying multiple approaches before finding the right one
- After encountering framework-specific gotchas
- After discovering new patterns or best practices

**Don't prompt if:**
- Session was simple (typo fixes, documentation updates)
- No mistakes or learnings occurred
- User already used /learn during the session

**Example:**
```
User: /commit

Claude:
[Creates commits for payment integration]

✅ Commits created successfully!

💡 During this session, I noticed we:
- Initially forgot to add error handling to the webhook
- Had to retry the Lemon Squeezy integration 3 times
- Discovered the test vs production API key difference

Would you like to document any of these learnings?

Examples:
  /learn "Webhook handlers need explicit try-catch for proper status codes"
  /learn "Lemon Squeezy test vs prod API keys must be environment-specific"
```
