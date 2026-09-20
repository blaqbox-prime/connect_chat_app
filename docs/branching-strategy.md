# Branching Strategy

This document defines the branching strategy for the Connect Chat App. The strategy is lightweight by design — sized for a single developer — while keeping `main` permanently production-ready.

## Branch Overview

| Branch     | Type      | Purpose                              | Lifecycle              |
| ---------- | --------- | ------------------------------------ | ---------------------- |
| `main`     | Long-lived (protected) | Always production-ready code. Direct pushes and PRs from feature/bugfix/hotfix branches are not allowed. | Permanent |
| `dev`      | Long-lived | Integration branch where all work is combined and verified before shipping. | Permanent |
| `feature/*`| Short-lived | New functionality. Branch from `dev`, merge back into `dev`. | Temporary |
| `bugfix/*` | Short-lived | Non-critical fixes. Branch from `dev`, merge back into `dev`. | Temporary |
| `hotfix/*` | Short-lived | Critical production fixes. Branch from `main`, merge back into `main` **and** `dev`. | Temporary |

## Rules at a Glance

- `main` is the only branch that deploys to production. It is always production-ready.
- Only `dev` may open pull requests into `main`.
- All `feature/*`, `bugfix/*`, and `hotfix/*` work is integrated through `dev`.
- Short-lived branches are deleted after they are merged.

---

## `main`

`main` is the production branch.

- Every commit on `main` is deployable and production-ready.
- `main` is **locked**: no one pushes to it directly, including the repository owner.
- The only way code enters `main` is through a pull request from `dev`.
- Releases are tagged from `main` (e.g. `v1.0.0`).

## `dev`

`dev` is the integration branch.

- All feature and bugfix work is merged here.
- `dev` is the only branch allowed to open pull requests into `main`.
- Before a PR is opened from `dev` to `main`, run the full pipeline/checks locally and verify nothing is broken.
- Ideally, `main` only advances by increments that are already proven in `dev`.

---

## Feature Branches

**Naming:** `feature/<short-description>`

Examples: `feature/login-screen`, `feature/group-chats`, `feature/audio-messages`

**Workflow:**

1. Branch from `dev`: `git checkout dev && git pull origin dev && git checkout -b feature/<short-description>`
2. Implement the feature, committing frequently with clear messages.
3. Keep `dev` up to date by rebasing occasionally: `git fetch origin && git rebase origin/dev`
4. When done, merge back into `dev` (or open a PR into `dev`):
   `git checkout dev && git pull origin dev && git merge --no-ff feature/<short-description>`
5. Push to `dev` and delete the feature branch.

**Do not** merge a feature branch into `main` directly.

## Bugfix Branches

**Naming:** `bugfix/<short-description>`

Examples: `bugfix/typo-in-register`, `bugfix/avatar-not-loading`

**Workflow:**

1. Branch from `dev`: `git checkout dev && git pull origin dev && git checkout -b bugfix/<short-description>`
2. Fix the bug and commit.
3. Merge back into `dev` (or open a PR into `dev`).
4. The fix ships to production later, together with the next `dev` → `main` merge.

**Do not** use a `bugfix` branch for issues that must reach production immediately — use a `hotfix` instead.

## Hotfix Branches

**Naming:** `hotfix/<short-description>`

Examples: `hotfix/auth-crash`, `hotfix/segfault-on-launch`

Used for critical issues in production that cannot wait for the next `dev` → `main` cycle.

**Workflow:**

1. Branch from `main` (not `dev`): `git checkout main && git pull origin main && git checkout -b hotfix/<short-description>`
2. Fix the issue and commit.
3. Open a pull request from the `hotfix/*` branch directly into `main` (this is the exception to the "only `dev` merges into `main`" rule), or merge it into `main` if you have release access.
4. Tag the release immediately so production has a clear version.
5. **Merge the hotfix into `dev` too** so the fix is not lost when the next integration happens:
   `git checkout dev && git pull origin dev && git merge --no-ff hotfix/<short-description>`
6. Delete the hotfix branch.

---

## Commit Messages

- Use clear, imperative messages: `Add login screen`, `Fix crash on app launch`, `Update README`.
- Reference the issue/ticket when applicable.

## CI / Checks (Planned)

Pipelines and automated checks will be added later. Planned checks:

- Lint and typecheck on every push to any branch.
- Automatic tests on `dev` push and on PRs into `dev`.
- **`main` protection:** require checks to pass and the `dev` PR to be reviewed/approved before merge.
- Optional: auto-deploy `main` after a successful merge.