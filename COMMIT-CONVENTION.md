# Commit Message Convention

This project uses **Conventional Commits**. Write every commit message in
English and describe the change clearly so the project history is easy to scan,
search, and use for release notes.

## Format

```text
<type>[optional scope][!]: <short description>

<body explaining what changed and why>

<optional footer(s)>
```

- `type` is required and lowercase.
- `scope` is optional. Use a short, lowercase English area or feature name,
  such as `guardians`, `routes`, `database`, or `config`.
- `!` is optional and marks a breaking change.
- The short description is required. Use the imperative mood, capitalize its
  first word, and do not end it with a period.
- The body is required in this project. In one or more concise paragraphs,
  explain what changed and why. Write complete English sentences.
- Footers are optional and should follow the Conventional Commits format.

## Commit Types

| Type | Use it for |
|---|---|
| `feat` | Adding user-facing behavior or a new API capability |
| `fix` | Correcting a bug |
| `docs` | Adding or changing documentation |
| `refactor` | Restructuring code without changing its behavior |
| `perf` | Improving performance |
| `test` | Adding or changing tests |
| `build` | Changing build tools, dependencies, or build configuration |
| `ci` | Changing continuous integration or delivery configuration |
| `chore` | Routine maintenance that does not fit another type |
| `style` | Formatting-only changes that do not affect behavior |
| `revert` | Reverting a previous commit |

Choose the type that best describes the primary change. Do not use `feat` for a
code reorganization that adds no behavior; use `refactor` instead.

## Writing the Description and Body

- Keep the description concise and specific. Aim for 50 characters or fewer
  when practical.
- Say what the commit does, not just which files it touches.
- Use the imperative mood, as if completing the phrase “This commit will…”.
- Explain the reason or relevant behavior in the body; avoid vague text such as
  “small changes”, “updates”, or “fix stuff”.
- Keep each commit focused on one logical change. Split unrelated work into
  separate commits.
- Use English for the type, scope, description, body, and any custom footer
  text.

## Breaking Changes and References

Mark a breaking change with `!` after the type or scope, and explain its impact
in the body. Add a `BREAKING CHANGE:` footer describing what users must change:

```text
feat(api)!: Rename guardian routes

Move the guardian endpoints to the English `/guardians` path. API clients using
`/guardianes` must update their requests before upgrading.

BREAKING CHANGE: `/guardianes` is no longer available; use `/guardians`.
```

Reference tracked work in a footer when appropriate, for example:

```text
Refs: #42
```

Use the issue or pull request reference format required by the hosting
repository.

## Examples

### New API capability

```text
feat(guardians): Add guardian CRUD endpoints

Add list, read, create, update, and delete operations for guardians. Validate
request fields and return related document type and legal status data.
```

### Bug fix

```text
fix(guardians): Reject unsafe numeric identifiers

Validate guardian IDs before converting them to BigInt so rounded JavaScript
numbers cannot target an unintended database record.
```

### Documentation

```text
docs(api): Explain how to add model endpoints

Document the routes and controllers structure, route aggregator registration,
Prisma usage, error handling, and verification steps for new API resources.
```

### Refactor

```text
refactor(routes): Collect endpoints in the route aggregator

Move route registration into `src/routes/router.ts` so `app.ts` mounts a single
application router while preserving the existing endpoint behavior.
```

### Dependency or build change

```text
build(deps): Update Express type definitions

Update the Express TypeScript definitions to match the installed major version
and keep route handlers type-safe.
```
