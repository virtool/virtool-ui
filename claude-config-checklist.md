# Claude Config Checklist

Checklist for setting up Claude Code configuration in a project. Derived from
Gnomux and Ideic configs. Adapt specifics to the project's language and tooling.

## User Settings (`~/.claude/settings.json`)

- [ ] Set `defaultMode` (default, plan, auto, etc.)
- [ ] Allow read-only tools globally (Glob, Grep, Read, WebFetch, WebSearch)
- [ ] Allow safe git commands globally (status, diff, log, branch, fetch, stash, add, commit, mv, rm)
- [ ] Allow safe gh read commands globally (pr view/list/status/checks/diff, run list/view, release list/view, repo view, workflow list/view)
- [ ] Deny reading secret files (`.env`, credentials)
- [ ] Deny destructive commands globally (e.g., `gh pr merge`)
- [ ] Configure statusline if using one
- [ ] Enable plugins relevant across projects
- [ ] Set attribution format (commit, PR)

## Project CLAUDE.md

### Linear / Issue Tracker

- [ ] Document team name and ID
- [ ] Document default label(s) and status for new issues
- [ ] Document issue title conventions (e.g., capitalization)
- [ ] State whether comments should be updated during work
- [ ] State expectation for associating work with issues

### Tooling

- [ ] Document how to run type checking
- [ ] Document how to run linting and formatting (and autofix)
- [ ] Document how to run tests (full suite and filtered)
- [ ] Document how to run e2e/integration tests
- [ ] Document the dev server command and port
- [ ] State when to run full-suite checks vs. targeted checks
- [ ] State which checks to run before committing

### Architecture

- [ ] Document where key categories of code live (e.g., API integrations, shared types, DB layer)
- [ ] Document any vocabulary conventions (e.g., "remove" vs "delete" semantics)
- [ ] Document key architectural decisions and constraints
- [ ] Point to a decisions log if one exists

### Code Style

- [ ] Import ordering and grouping rules
- [ ] Type/interface preference
- [ ] Function style preference (declarations vs. arrows, named vs. anonymous)
- [ ] Conditional class/style utility (e.g., `cn()`, `clsx()`)
- [ ] Rules about magic values, inline constants, and design tokens
- [ ] Where to find shared utilities, colors, and constants before creating new ones
- [ ] Error handling patterns (e.g., shared `getErrorMessage()`)
- [ ] Path alias conventions (e.g., `@lib/`, `@db/`)
- [ ] Required vs. optional property policy on types

### Git

- [ ] Commit message format (Conventional Commits, etc.)
- [ ] Commit type definitions and when to use each
- [ ] Title style: casing, length limits, user-facing vs. dev-facing language
- [ ] Body style: when to include, brevity expectations
- [ ] Policy on pushing and creating PRs (only when asked, etc.)
- [ ] Any flags or options to avoid (e.g., `-C`)

### Testing

- [ ] Test directory naming convention
- [ ] Test file location relative to source
- [ ] Where test data and fixtures live
- [ ] Coverage expectations for new and modified code
- [ ] Test independence rules
- [ ] Setup helper placement (module-level vs. inside describe)
- [ ] Assertion style (explicit vs. snapshot)
- [ ] Mocking conventions (global mocks, fetch stubs, timers)
- [ ] Component/UI test patterns (event library, query preference, router handling)
- [ ] Database/state test patterns (lifecycle helpers, cleanup)
- [ ] Shared test infrastructure location and reuse policy
- [ ] Point to a testing guide if one exists

### Help / Docs Content

- [ ] Where user-facing docs live and how they're registered
- [ ] When to update docs (feature add/remove/change)
- [ ] Style guidance for docs (brevity, structure)

### General Rules

- [ ] Policy on comments (when to add, when not to)
- [ ] External docs lookup (Context7, official docs, etc.)

## Project Settings (`settings.json`)

- [ ] Allow project-specific commands (test runner, linter, build, etc.)
- [ ] Allow project-specific MCP tools (Linear update, etc.)

## Hooks

- [ ] Post-write hook for autoformatting on save
- [ ] Any other lifecycle hooks (pre-commit, post-commit, etc.)

## Custom Skills

- [ ] Research/discovery skill for deep project exploration
- [ ] Decision/interview skill for walking through project direction
- [ ] Issue creation skill for building issue DAGs from decisions
- [ ] Issue-to-plan skill for planning from branch's linked issue
- [ ] Minimal first step skill
- [ ] PR creation skill with project-specific conventions
