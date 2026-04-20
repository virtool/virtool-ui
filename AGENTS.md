# Virtool UI

React + TypeScript single-page application for Virtool, a bioinformatics platform.

## Tooling

### Commands

| Task | Command |
| --- | --- |
| Dev server | `npm run develop` (Vite, port 5173) |
| Typecheck | `npm run typecheck` |
| Lint + format | `npm run check` |
| Lint only | `npm run lint` |
| Format only | `npm run format` |
| Test (watch) | `npm run test` |
| Test (single run) | `npx vitest run` |
| Test (filtered) | `npx vitest run src/path/to/file` |
| Storybook | `npm run storybook` (port 6006) |
| Build | `npm run build` |

### When to run checks

- Before committing: `npm run check` and `npm run typecheck`.
- After changing tests: run the specific test file with `npx vitest run <path>`.
- Full test suite only when asked or when changes are cross-cutting.
- Always fix all lint errors and warnings. The main branch is guaranteed to pass
  `npm run check` cleanly, so any issues are caused by your changes — never
  dismiss them as pre-existing.

## Architecture

### Directory structure

Source lives in `src/`. Each top-level directory is a feature module:

- `src/account/` - User account management
- `src/administration/` - Admin settings
- `src/analyses/` - Analysis workflows
- `src/app/` - App shell, routing, theme, shared utilities
- `src/base/` - Shared UI components (buttons, dialogs, forms, tables, etc.)
- `src/forms/` - Form components and patterns
- `src/groups/` - User groups
- `src/hmm/`, `src/indexes/`, `src/ml/` - Bioinformatics features
- `src/otus/`, `src/sequences/`, `src/references/`, `src/samples/` - Core data models
- `src/subtraction/` - Subtraction management
- `src/labels/`, `src/jobs/`, `src/uploads/` - Supporting features
- `src/nav/` - Navigation
- `src/server/` - Express SSR server
- `src/tests/` - Test setup, fakes, and API mocks
- `src/types/` - Shared type definitions

### Path aliases

Every feature directory has a `@name` alias (e.g., `@app/utils`, `@base/Button`,
`@samples/api`). The catch-all `@/*` maps to `src/*`. Prefer specific aliases over
`@/`.

### Key libraries

- **React 19** with React Compiler (babel plugin)
- **wouter** for routing
- **React Query** (`@tanstack/react-query`) for server state
- **zustand** for client state
- **react-hook-form** + **zod** for forms and validation
- **superagent** for API calls (via `@app/api.ts` client)
- **styled-components** for CSS-in-JS (legacy, still in use)
- **Tailwind CSS v4** for utility styles (preferred for new code)
- **Radix UI** primitives for accessible components
- **CVA** (`class-variance-authority`) for component variants
- **Lucide React** for icons

### API calls

Use the superagent-based client in `src/app/api.ts`. Feature API functions live in
each module's `api.ts`. API errors have the shape `error.response?.body.message`.

### Styling

- Use Tailwind utility classes for new code.
- Use the `cn()` function from `@app/utils` for conditional classes (combines `clsx`
  + `tailwind-merge`).
- Don't use arbitrary Tailwind classes like `max-h-[210px]`.
- Existing styled-components are fine to maintain; prefer Tailwind for new work.
- Design tokens and theme are in `src/app/theme.ts`. Check there before inventing
  colors or spacing values.
- Tailwind theme customization is in `src/app/style.css` via `@theme`.

## Projects

Ongoing projects are documented in `docs/projects/`. These correspond to Linear
projects. If your task relates to a project, check that directory for constraints,
mappings, or decisions that apply to your work.

- **Remove styled-components**: `docs/projects/remove-styled-components.md`

## Linear

- **Team**: Virtool
- **Team ID**: `76cf3c46-c5d9-4df4-b457-0fc053d402f7`
- **Issue prefix**: `VIR`
- **Default label**: Frontend

## Code Style

- **Functions:** Use function declarations, not arrow functions (`func-style`
  enforced).
- **Imports:** Biome organizes imports automatically.
- **Conditionals:** Always use curly braces with `if`/`else`.
- **Prefer `const`** over `let`.

## Git

Commit messages use **Conventional Commits**:

```
type(scope): description
```

Types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`.

- Title: lowercase, no period, under 72 characters.
- Scope is optional but preferred.
- Don't push or create PRs unless asked.
- Don't include a Test plan section in PR descriptions.
- Don't use `git -C <path>` unless necessary. It triggers permission prompts that
  aren't worth the trouble. Run git commands from the working directory instead.

## Testing

- **Framework:** Vitest with jsdom environment.
- **Test location:** `__tests__/` directories alongside source files.
- **Test files:** `ComponentName.test.tsx` or `functionName.test.ts`.
- **Imports:** Use explicit vitest imports (`import { describe, it, expect, vi } from
  "vitest"`).
- **Setup:** `src/tests/setup.tsx` provides `renderWithProviders()`,
  `renderWithRouter()`, and `MemoryRouter`.
- **Fixtures/fakes:** `src/tests/fake/` has factory functions for test data.
- **Assertions:** Use explicit `expect()` assertions, not snapshots.
- **User interaction:** Use `@testing-library/user-event` over `fireEvent`.
- **Queries:** Prefer accessible queries (`getByRole`, `getByLabelText`) over
  `getByTestId`.
