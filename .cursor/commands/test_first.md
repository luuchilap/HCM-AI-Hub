# Test-First Development

You are tasked with generating comprehensive test suites from feature requirements BEFORE any implementation code exists. This enables test-driven development where tests validate behavior, not implementation.

**Philosophy**: Write tests that will fail initially (no implementation yet), then implement until tests pass.

---

## Initial Response

When this command is invoked:

1. **Check if parameters were provided**:
   - If a plan file path or feature description was provided, skip the default message
   - Immediately read any provided plan files FULLY
   - Begin the test generation process

2. **If no parameters provided**, respond with:
```
I'll help you create a test-first test suite from your feature requirements.

Please provide ONE of:
1. Path to a feature plan file (e.g., thoughts/shared/plans/2025-12-05-feature.md)
2. Inline feature description with requirements and acceptance criteria
3. User story with expected behavior

I'll generate comprehensive tests that will guide your implementation.

Example: /test_first thoughts/shared/plans/2025-12-05-credit-balance-ui.md
Example: /test_first "Credit balance widget that shows remaining minutes in dashboard header"
```

Then wait for the user's input.

---

## Process Steps

### Step 1: Understand Feature Requirements

1. **Read feature description/plan FULLY**:
   - If a file path is provided, read the ENTIRE file
   - Extract: requirements, acceptance criteria, user flows, edge cases
   - Identify: inputs, outputs, state changes, API contracts

2. **Analyze existing test patterns**:
   - Check `.claude/PATTERNS.md` for testing patterns in this project
   - Look for existing tests to understand structure:
     - Component tests in `tests/components/`
     - Convex function tests in `tests/convex/` (if they exist)
     - E2E tests in `tests/e2e/` or `e2e/`
   - Identify test framework: Jest, Vitest, Playwright, etc.

3. **Determine test scope**:
   Based on the feature, identify what types of tests are needed:
   - **Unit tests**: Pure functions, utilities, helpers
   - **Component tests**: React components, UI interactions
   - **Integration tests**: Convex functions, API endpoints, database operations
   - **E2E tests**: User flows, critical paths (optional, for complex features)

4. **Present test plan to user**:
   ```
   Based on the feature requirements, I'll generate the following tests:

   📦 Unit Tests:
   - [Test file]: [Test descriptions]

   🎨 Component Tests:
   - [Test file]: [Test descriptions]

   🔗 Integration Tests:
   - [Test file]: [Test descriptions]

   🌐 E2E Tests (optional):
   - [Test file]: [Test descriptions]

   These tests will fail initially (no implementation exists).
   After implementation, these tests will validate correctness.

   Proceed with test generation?
   ```

### Step 2: Generate Test Scaffolding

**CRITICAL**: Use the test-engineer agent for test generation.

1. **Spawn test-engineer agent** with test-first mode:
   ```
   Generate test-first test suite for [feature name].

   **Context**:
   - Feature requirements: [requirements from plan]
   - Test framework: [Jest/Vitest/Playwright based on project]
   - Test patterns: [reference .claude/PATTERNS.md]

   **Requirements**:
   - Tests should describe expected behavior from requirements
   - Tests will FAIL initially (no implementation yet)
   - Use descriptive test names that explain "what" not "how"
   - Include happy path, edge cases, and error scenarios
   - Follow existing test patterns in this project

   **Output**:
   - Test files with complete test cases
   - Setup/teardown where needed
   - Mock data and fixtures
   - Clear comments explaining test intent
   ```

2. **Agent should generate**:
   - Test file(s) in appropriate directories
   - Test cases covering all acceptance criteria
   - Mock data for external dependencies
   - Setup/teardown for database/state cleanup
   - Descriptive test names and assertions

### Step 3: Review & Validate Generated Tests

1. **Read generated test files**:
   - Verify tests cover all requirements
   - Check test structure matches project patterns
   - Ensure tests are clear and maintainable

2. **Validate test quality**:
   - ✅ Do tests describe behavior from user's perspective?
   - ✅ Do tests avoid implementation details?
   - ✅ Are test names descriptive and clear?
   - ✅ Do tests cover happy path + edge cases + errors?
   - ✅ Are external dependencies mocked appropriately?

3. **Present test summary to user**:
   ```
   ✅ Test suite generated successfully!

   📁 Test Files Created:
   - tests/components/CreditBalance.test.tsx (5 test cases)
   - tests/convex/subscription.test.ts (8 test cases)

   📊 Coverage:
   - Happy path scenarios: 3 tests
   - Edge cases: 6 tests
   - Error handling: 4 tests

   ⚠️ Expected Behavior:
   All tests will FAIL when you run them (implementation doesn't exist yet).
   This is correct - tests define the contract for your implementation.

   Next Steps:
   1. Run tests to see failures: npm test
   2. Implement feature to make tests pass
   3. Iterate until all tests green
   ```

---

## Test Generation Guidelines

### Test Naming Conventions

**✅ Good Test Names** (describe behavior):
```typescript
test('displays remaining credits in dashboard header')
test('shows zero when user has no credits')
test('updates balance after credit purchase')
test('disables interview start button when credits insufficient')
test('throws error when deducting more credits than available')
```

**❌ Bad Test Names** (describe implementation):
```typescript
test('calls useQuery hook')
test('renders div with className')
test('updates state variable')
```

### Test Structure Patterns

**Component Tests** (React):
```typescript
import { render, screen } from '@testing-library/react';
import { CreditBalance } from '@/components/CreditBalance';

describe('CreditBalance Component', () => {
  test('displays remaining credits in dashboard header', () => {
    render(<CreditBalance credits={30} />);
    expect(screen.getByText('30 minutes remaining')).toBeInTheDocument();
  });

  test('shows zero when user has no credits', () => {
    render(<CreditBalance credits={0} />);
    expect(screen.getByText('0 minutes remaining')).toBeInTheDocument();
    expect(screen.getByText('Get more credits')).toBeInTheDocument();
  });

  test('updates balance after credit purchase', async () => {
    const { rerender } = render(<CreditBalance credits={30} />);
    expect(screen.getByText('30 minutes remaining')).toBeInTheDocument();

    rerender(<CreditBalance credits={60} />);
    expect(screen.getByText('60 minutes remaining')).toBeInTheDocument();
  });
});
```

**Convex Function Tests** (Integration):
```typescript
import { convexTest } from 'convex-test';
import { api } from '../convex/_generated/api';

describe('subscription.checkCredits', () => {
  test('returns current credit balance for user', async () => {
    const t = convexTest();
    const userId = 'user_123';

    // Setup: Create user profile with credits
    await t.run(async (ctx) => {
      await ctx.db.insert('userProfiles', {
        userId,
        credits: 30,
        totalCreditsEarned: 60,
        totalCreditsUsed: 30,
      });
    });

    // Act: Query credits
    const result = await t.query(api.subscription.checkCredits, { userId });

    // Assert: Returns correct balance
    expect(result.credits).toBe(30);
    expect(result.totalEarned).toBe(60);
    expect(result.totalUsed).toBe(30);
  });

  test('throws error when deducting more credits than available', async () => {
    const t = convexTest();
    const userId = 'user_123';

    // Setup: User with 10 credits
    await t.run(async (ctx) => {
      await ctx.db.insert('userProfiles', { userId, credits: 10 });
    });

    // Act & Assert: Attempting to deduct 20 credits should fail
    await expect(
      t.mutation(api.subscription.deductCredits, {
        userId,
        interviewId: 'interview_123',
        durationMinutes: 20,
      })
    ).rejects.toThrow('Insufficient credits');
  });
});
```

**E2E Tests** (Playwright - optional):
```typescript
import { test, expect } from '@playwright/test';

test.describe('Credit Balance Flow', () => {
  test('shows credit balance and allows purchase', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');

    // Verify credit balance is visible
    const balance = page.locator('[data-testid="credit-balance"]');
    await expect(balance).toContainText('30 minutes');

    // Click to purchase more credits
    await page.click('[data-testid="buy-credits-btn"]');

    // Verify redirected to pricing page
    await expect(page).toHaveURL('/pricing');
  });
});
```

---

## Test Coverage Checklist

For each feature, ensure tests cover:

### ✅ Happy Path
- Primary user flow works as expected
- Data is displayed correctly
- Actions complete successfully

### ✅ Edge Cases
- Empty states (no data, zero values)
- Boundary values (max/min limits)
- Multiple items vs single item
- First-time users vs returning users

### ✅ Error Handling
- Invalid input rejected
- Network errors handled gracefully
- Permission errors shown clearly
- Database errors don't crash app

### ✅ State Management
- Data updates reflected in UI
- Optimistic updates roll back on error
- Loading states shown during async operations
- Error states cleared after retry

### ✅ Integration Points
- External APIs mocked appropriately
- Database operations use test fixtures
- Authentication bypassed in tests
- File uploads use mock data

---

## Important Notes

### DO NOT Generate Implementation Code
- Tests should describe behavior, not contain implementation
- Tests reference components/functions that don't exist yet
- This is correct - tests will fail until implementation is created

### Reference Existing Patterns
- Always check `.claude/PATTERNS.md` for project-specific test patterns
- Look at existing tests in `tests/` directory for structure
- Follow the same test framework and conventions

### Make Tests Maintainable
- Use descriptive test names (behavior, not implementation)
- Keep tests independent (no shared state between tests)
- Use fixtures and factories for test data
- Group related tests in describe blocks

### Test Behavior, Not Implementation
```typescript
// ❌ Bad: Tests implementation details
test('calls useState hook', () => {
  const spy = jest.spyOn(React, 'useState');
  render(<Component />);
  expect(spy).toHaveBeenCalled();
});

// ✅ Good: Tests behavior
test('displays credit balance when provided', () => {
  render(<CreditBalance credits={30} />);
  expect(screen.getByText('30 minutes')).toBeInTheDocument();
});
```

---

## Integration with Development Workflow

### Standalone Usage
```bash
/test_first thoughts/shared/plans/2025-12-05-feature.md
# Generates tests, you implement manually
```

### With /implement_plan (Future)
```bash
/implement_plan thoughts/shared/plans/2025-12-05-feature.md --test-first
# Calls /test_first internally, then implements until tests pass
```

### With /scaffold (Future)
```bash
/test_first "Feature description"
/scaffold "Feature description"
# Tests exist before scaffold, guide implementation
```

---

## Success Criteria

A test-first test suite is successful when:

1. ✅ **All tests fail initially** (no implementation exists)
2. ✅ **Tests are clear and readable** (describe behavior from user perspective)
3. ✅ **Coverage is comprehensive** (happy path, edge cases, errors)
4. ✅ **Tests are maintainable** (independent, use fixtures, well-structured)
5. ✅ **Implementation is guided by tests** (contract-driven development)

---

## Example Session

**User**: `/test_first thoughts/shared/plans/2025-12-05-credit-balance-widget.md`

**Claude**:
```
Reading feature plan...

Based on the requirements, I'll generate the following tests:

📦 Unit Tests:
- tests/lib/formatCredits.test.ts
  - Formats credits as "X minutes"
  - Handles zero credits
  - Handles singular "1 minute"

🎨 Component Tests:
- tests/components/CreditBalance.test.tsx
  - Displays credit balance in header
  - Shows "Get credits" link when zero
  - Updates when credits change
  - Shows loading skeleton during fetch

🔗 Integration Tests:
- tests/convex/subscription.test.ts
  - checkCredits returns user balance
  - Handles user without profile
  - Filters by userId (security)

Proceed with test generation?
```

**User**: Yes

**Claude**:
```
Spawning test-engineer agent to generate test suite...

[Agent generates tests]

✅ Test suite generated successfully!

📁 Test Files Created:
- tests/lib/formatCredits.test.ts (3 test cases)
- tests/components/CreditBalance.test.tsx (5 test cases)
- tests/convex/subscription.test.ts (4 test cases)

⚠️ All 12 tests will FAIL when run (expected - no implementation yet)

Next Steps:
1. Run tests: npm test
2. Implement formatCredits helper
3. Implement CreditBalance component
4. Implement checkCredits Convex query
5. Iterate until all tests pass

Would you like to start implementation?
```

---

## Relationship to Other Commands

- **Precedes**: `/implement_plan`, `/scaffold` (tests written before code)
- **Works with**: `/validate_plan` (validates implementation against tests)
- **Followed by**: `/commit` (commit passing tests + implementation)
- **Informs**: `/vibe_audit` (tests become documentation of behavior)

---

**Remember**: The goal is to write tests that describe WHAT the feature should do, not HOW it does it. Tests are the contract that implementation must fulfill.
