# Vibe Audit - Weekly Pattern Analysis

You are tasked with conducting systematic pattern analysis across the codebase to detect architectural drift, systematic issues, and emerging technical debt. This is NOT a line-by-line code review - it's a high-level pattern recognition exercise.

**Philosophy**: Catch systemic issues before they become problems by analyzing patterns, not individual changes.

**Inspired by**: Principal engineer's "vibe code audit" - weekly pattern reviews that caught 3 major security issues traditional PR reviews missed.

---

## Initial Response

When this command is invoked:

1. **Check if parameters were provided**:
   - `--period weekly|monthly` (default: weekly)
   - `--scope file|module|project|commits` (default: project)
   - `--focus security|performance|quality|architecture|all` (default: all)

2. **Default response** (no parameters):
```
I'll conduct a vibe audit to analyze patterns in your codebase.

Configuration:
- Period: Last 7 days (weekly)
- Scope: Entire project
- Focus: All domains (architecture, security, performance, quality)

This audit looks for PATTERNS, not individual issues:
- Repeated code structures that indicate architectural patterns
- Systematic security or performance anti-patterns
- Emerging technical debt across multiple files
- Architectural consistency and drift

Proceed with audit?
```

3. **With parameters**:
```bash
/vibe_audit project --period monthly --focus security
```

---

## Process Steps

### Step 1: Gather Context

1. **Determine audit scope**:
   - **weekly**: Last 7 days of commits
   - **monthly**: Last 30 days of commits
   - **file**: Single file pattern analysis
   - **module**: Directory/feature module
   - **project**: Entire codebase (default)

2. **Analyze git history**:
   ```bash
   # Get commits from audit period
   git log --since="7 days ago" --oneline --stat

   # Get changed files
   git diff --name-only HEAD~20 HEAD

   # Get commit count and author activity
   git shortlog --since="7 days ago" -sn
   ```

3. **Read institutional knowledge**:
   - `.claude/PATTERNS.md` - Known good patterns
   - `.claude/GOTCHAS.md` - Known anti-patterns
   - Compare current code against documented patterns

### Step 2: Pattern Analysis (Parallel Agent Spawning)

**CRITICAL**: Spawn specialized agents in PARALLEL for comprehensive analysis.

Launch 3-5 agents concurrently based on `--focus` parameter:

#### Agent 1: Architecture Patterns (systems-architect)
```
Analyze architectural patterns in codebase over last [period].

**Focus**:
- Consistency: Are similar features implemented similarly?
- Layering: Clear separation of concerns (UI, business logic, data)?
- Coupling: Are components tightly coupled or loosely coupled?
- Patterns: MVC, MVVM, Clean Architecture adherence?
- Drift: Has architecture diverged from established patterns?

**Look for**:
- Repeated patterns across multiple files (good or bad)
- Violations of documented patterns in .claude/PATTERNS.md
- Emerging patterns that should be documented
- Architectural inconsistencies

**Deliverables**:
- List of observed patterns (positive and negative)
- Architectural drift indicators
- Recommendations for pattern documentation
```

#### Agent 2: Security Patterns (security-auditor)
```
Analyze security patterns in codebase over last [period].

**Focus**:
- Input validation: Consistent validation across endpoints?
- Authentication: Proper auth checks in all protected routes?
- Authorization: Row-level security in database queries?
- Data exposure: Accidental exposure of sensitive data?
- OWASP Top 10: Patterns that indicate vulnerabilities?

**Look for**:
- Routes missing authentication
- Queries without user ID filtering
- Hardcoded secrets or API keys
- Insecure patterns repeated across files
- Violations of security patterns in .claude/PATTERNS.md

**Deliverables**:
- Security pattern violations
- Systematic security gaps
- Recommendations for security improvements
```

#### Agent 3: Performance Patterns (performance-engineer)
```
Analyze performance patterns in codebase over last [period].

**Focus**:
- N+1 queries: Multiple database calls in loops?
- Caching: Appropriate use of caching layers?
- Loading states: Async operations have loading indicators?
- Bundle size: Large imports or dependencies added?
- Database indexes: Queries using proper indexes?

**Look for**:
- Repeated N+1 query patterns
- Missing optimizations (memoization, lazy loading)
- Performance anti-patterns from .claude/GOTCHAS.md
- Opportunities for performance improvements

**Deliverables**:
- Performance anti-patterns
- Optimization opportunities
- Recommendations for performance improvements
```

#### Agent 4: Code Quality Patterns (refactor-expert)
```
Analyze code quality patterns in codebase over last [period].

**Focus**:
- Duplication: Similar code repeated across files?
- Complexity: Functions/components growing too complex?
- Naming: Consistent and descriptive naming?
- Testing: Test coverage trends (increasing or decreasing)?
- Documentation: Code comments where needed?

**Look for**:
- Copy-pasted code that should be abstracted
- Functions exceeding complexity thresholds
- Inconsistent naming conventions
- Areas lacking tests
- Technical debt accumulation

**Deliverables**:
- Code duplication patterns
- Complexity hotspots
- Quality improvement recommendations
```

#### Agent 5: Framework/Library Usage Patterns (Optional)
```
Analyze framework and library usage patterns over last [period].

**Focus**:
- Consistency: Same libraries used for similar tasks?
- Deprecations: Use of deprecated APIs or patterns?
- Best practices: Following framework conventions?
- Version drift: Multiple versions of same library?

**Look for**:
- Inconsistent library choices
- Anti-patterns specific to frameworks (React, Next.js, Convex)
- Violations of patterns in .claude/PATTERNS.md
- Opportunities to standardize

**Deliverables**:
- Framework usage patterns
- Library inconsistencies
- Recommendations for standardization
```

### Step 3: Aggregate Analysis

After agents complete:

1. **Read all agent reports**:
   - Architectural patterns and drift
   - Security vulnerabilities and gaps
   - Performance bottlenecks
   - Code quality issues
   - Framework usage inconsistencies

2. **Identify cross-cutting patterns**:
   - Issues appearing in multiple agent reports
   - Systemic problems vs one-off issues
   - Root causes behind multiple symptoms

3. **Prioritize findings**:
   - **🚨 Critical**: Security vulnerabilities, production risks
   - **⚠️ High**: Performance issues, architectural drift
   - **📊 Medium**: Code quality, technical debt
   - **💡 Low**: Style inconsistencies, minor optimizations

### Step 4: Generate Audit Report

Create comprehensive report in `thoughts/shared/audits/YYYY-MM-DD-vibe-audit.md`:

**Report Structure:**

```markdown
# Vibe Audit: [Date] ([Period])

**Audit Configuration**:
- Period: [weekly/monthly]
- Scope: [project/module/file]
- Focus: [all/security/performance/quality/architecture]
- Commits Analyzed: [N commits]
- Files Changed: [N files]

---

## 🎯 Executive Summary

**Overall Health Score**: [Green/Yellow/Red]

**Key Findings**:
1. [Most important pattern/issue discovered]
2. [Second most important]
3. [Third most important]

**Immediate Actions Required**: [N critical items]

---

## 📊 Patterns Observed

### ✅ Positive Patterns
- [Pattern]: [Description] ([N occurrences])
- [Pattern]: [Description] ([N occurrences])

### ⚠️ Anti-Patterns
- [Pattern]: [Description] ([N occurrences])
  - Files affected: [list]
  - Recommendation: [action]

---

## 🚨 Critical Issues (Immediate Action)

### 1. [Issue Title]
**Severity**: Critical
**Pattern**: [Describe the pattern]
**Occurrences**: [N files/instances]
**Files Affected**:
- file1.ts:line
- file2.ts:line

**Impact**: [Security/Performance/Reliability impact]
**Recommendation**: [Specific action to take]
**Reference**: [Link to .claude/GOTCHAS.md or PATTERNS.md if relevant]

---

## ⚠️ High-Priority Issues

### 1. [Issue Title]
**Severity**: High
**Pattern**: [Describe the pattern]
**Recommendation**: [Action]

---

## 📊 Medium-Priority Issues

### 1. [Issue Title]
**Severity**: Medium
**Pattern**: [Describe the pattern]
**Recommendation**: [Action]

---

## 💡 Improvement Opportunities

### Architecture
- [Opportunity]: [Description]

### Performance
- [Opportunity]: [Description]

### Code Quality
- [Opportunity]: [Description]

---

## 📈 Metrics & Trends

### Codebase Health
- Files changed: [N]
- Lines added: [+N]
- Lines removed: [-N]
- Net change: [±N]

### Test Coverage (if available)
- Current coverage: [X%]
- Change from last audit: [±X%]
- Untested files: [N]

### Complexity (if measurable)
- Average function complexity: [N]
- Files with high complexity: [N]

### Technical Debt
- Known gotchas: [N items in GOTCHAS.md]
- Documented patterns: [N items in PATTERNS.md]
- New patterns identified: [N]

---

## 🔄 Pattern Documentation Updates

### Add to .claude/PATTERNS.md
```markdown
## Pattern: [Name]
[Description and example]
```

### Add to .claude/GOTCHAS.md
```markdown
## Gotcha: [Name]
**Issue**: [Description]
**Prevention**: [How to avoid]
```

---

## 📝 Recommendations

### Immediate (This Week)
1. [Action]: [Description]
2. [Action]: [Description]

### Short-term (This Month)
1. [Action]: [Description]
2. [Action]: [Description]

### Long-term (This Quarter)
1. [Action]: [Description]
2. [Action]: [Description]

---

## 📚 Learning Opportunities

### New Patterns Discovered
- [Pattern]: Consider adding to PATTERNS.md

### Anti-Patterns to Avoid
- [Anti-pattern]: Consider adding to GOTCHAS.md

### Framework/Library Updates
- [Library]: New version available with relevant features

---

## 🎓 Team Knowledge Sharing

**Patterns Worth Discussing**:
1. [Pattern]: [Why it's interesting]
2. [Pattern]: [Why it's important]

**Technical Debt Priority**:
1. [Area]: [Impact and effort to fix]
2. [Area]: [Impact and effort to fix]

---

## 🔗 Related Documentation

- `.claude/PATTERNS.md` - Project patterns
- `.claude/GOTCHAS.md` - Known pitfalls
- `~/.claude/LEARNINGS.md` - Global learnings
- Previous audits: [Link to last audit]

---

**Next Audit**: [Recommended date for next review]
```

### Step 5: Update Institutional Knowledge

Based on findings:

1. **Prompt to update knowledge files**:
```
I've identified [N] new patterns and [N] new gotchas from this audit.

Should I update institutional knowledge files?
- Add [N] patterns to .claude/PATTERNS.md
- Add [N] gotchas to .claude/GOTCHAS.md
- Update docs/CLAUDE.md with critical findings

This will help prevent these issues in future work.
```

2. **If user approves, update files**:
   - Add new patterns to PATTERNS.md
   - Add new gotchas to GOTCHAS.md
   - Update relevant documentation

---

## Audit Focus Areas

### Security Audit (`--focus security`)
Concentrate on:
- Authentication and authorization patterns
- Input validation consistency
- Data exposure risks
- OWASP Top 10 indicators
- Secret management

### Performance Audit (`--focus performance`)
Concentrate on:
- N+1 query patterns
- Loading state coverage
- Bundle size trends
- Caching effectiveness
- Database query optimization

### Quality Audit (`--focus quality`)
Concentrate on:
- Code duplication
- Complexity metrics
- Test coverage
- Naming consistency
- Documentation quality

### Architecture Audit (`--focus architecture`)
Concentrate on:
- Pattern consistency
- Layering violations
- Coupling analysis
- Architectural drift
- Design pattern adherence

---

## Success Criteria

A successful vibe audit:

1. ✅ **Identifies Patterns** (not individual issues)
   - Systematic problems across multiple files
   - Architectural trends (good or bad)
   - Emerging patterns worth documenting

2. ✅ **Actionable Recommendations**
   - Specific steps to address issues
   - Prioritized by severity and impact
   - References to code locations

3. ✅ **Updates Institutional Knowledge**
   - New patterns added to PATTERNS.md
   - New gotchas added to GOTCHAS.md
   - Team learning opportunities identified

4. ✅ **Tracks Trends Over Time**
   - Comparable to previous audits
   - Metrics show improvement or degradation
   - Clear visibility into codebase health

---

## Example Scenarios

### Scenario 1: Weekly Security Audit
```bash
/vibe_audit project --period weekly --focus security

# Discovers:
# - 3 API routes missing authentication
# - Consistent pattern of queries without userId filter
# - Hardcoded API key in 2 new files

# Recommendations:
# - Add auth middleware to all /api routes
# - Update PATTERNS.md with "Always filter by userId"
# - Move API keys to environment variables
```

### Scenario 2: Monthly Architecture Review
```bash
/vibe_audit project --period monthly --focus architecture

# Discovers:
# - New components diverging from server/client boundary pattern
# - Increasing coupling between UI and Convex layers
# - Inconsistent use of preloadQuery vs useQuery

# Recommendations:
# - Refactor 5 components to proper server/client boundaries
# - Create abstraction layer between UI and Convex
# - Document query pattern in PATTERNS.md
```

### Scenario 3: Post-Feature Pattern Analysis
```bash
/vibe_audit module --scope convex/ --focus all

# Discovers:
# - Good: Consistent use of queryWithUser wrapper
# - Bad: 3 mutations missing error handling
# - Opportunity: Similar validation logic copy-pasted 5 times

# Recommendations:
# - Add error handling pattern to PATTERNS.md
# - Extract common validation to shared function
# - Document in next team review
```

---

## Integration with Other Commands

### After /implement_plan
```bash
/implement_plan thoughts/shared/plans/feature.md
# Feature implemented

/vibe_audit module --scope app/feature/
# Quick pattern check on new feature
```

### Before /commit
```bash
/vibe_audit commits --scope HEAD~5..HEAD
# Review last 5 commits for patterns
# Ensure consistency before committing
```

### Weekly Team Ritual
```bash
# Every Friday
/vibe_audit project --period weekly
# Review findings as team
# Update PATTERNS.md and GOTCHAS.md
# Plan refactoring priorities
```

---

## Important Notes

### This is NOT Line-by-Line Review
- Focus on patterns, not individual code quality
- Look for systematic issues, not one-off mistakes
- Identify trends across multiple files/commits
- Provide architectural insight, not implementation details

### Patterns vs Issues
```
❌ "Variable name should be camelCase" (individual issue)
✅ "10 files use snake_case while project standard is camelCase" (pattern)

❌ "This function is too long" (individual issue)
✅ "New components averaging 300+ lines, indicating need for composition pattern" (pattern)

❌ "Missing error handling here" (individual issue)
✅ "8 new mutations lack try-catch, systematic error handling gap" (pattern)
```

### Make It Actionable
Every finding should have:
- Clear description of the pattern
- Files/locations affected
- Impact assessment
- Specific recommendation
- Reference to documentation (if applicable)

---

## Relationship to Other Commands

- **Complements**: `/test_first` (tests validate behavior, audit validates architecture)
- **Informs**: `/learn` (patterns discovered become documented learnings)
- **Follows**: `/implement_plan` (audit after implementation to catch drift)
- **Precedes**: `/commit` (audit before committing major changes)

---

**Remember**: The goal is to catch systemic issues before they become ingrained in the codebase. Focus on patterns that, left unchecked, would create significant technical debt or architectural problems.
