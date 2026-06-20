# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands require Node and Cargo in PATH:
```
export PATH="/opt/homebrew/opt/node@26/bin:$HOME/.cargo/bin:$PATH"
```

| Task | Command |
|---|---|
| Dev (Tauri window + HMR) | `npm run tauri dev` |
| Type-check | `npx tsc --noEmit` |
| Frontend-only dev | `npm run dev` |
| Production build | `npm run tauri build` |

There are no automated tests. Type-checking (`tsc --noEmit`) is the primary correctness gate.

## Architecture

**Tauri 2 + React 19 + SQLite.** Rust process hosts the window; all app logic lives in the frontend (TypeScript). SQLite is accessed from the frontend via `@tauri-apps/plugin-sql` IPC calls — no custom Rust commands are needed.

### Data flow

```
SQLite (devtodo.db)
  └─ src/db/*.ts          — raw CRUD, each file maps to one table
       └─ src/store/index.ts  — single Zustand store; calls db layer, holds all app state
            └─ React components / views  — read store via useStore()
```

`src/db/index.ts` holds the singleton DB connection and runs migrations on first open. All dates are stored as Unix milliseconds (integers). `getTasks()` returns only non-done tasks; `getCompletedTasks()` returns only done tasks — both lists live in the store (`tasks` and `completedTasks`).

### Key files

- `src/types.ts` — shared TypeScript interfaces (`Project`, `Category`, `Task`, `View`)
- `src/store/index.ts` — entire app state + all actions; HMR hook at bottom re-calls `init()` on hot reload
- `src/db/migrations.ts` — DDL strings run once on startup (CREATE TABLE IF NOT EXISTS)
- `src-tauri/capabilities/default.json` — **must** include `sql:allow-load/execute/select/close`; omitting any permission causes the app to hang on "Loading..."
- `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge), `generateId()` (crypto.randomUUID), `PROJECT_COLORS`

### Views

- `DailyView` — cumulative: due today → overdue → upcoming (grouped by day) → no due date → done today
- `WeeklyView` — 7 `DayColumn` components, Mon–Sun
- `MonthlyView` — calendar grid; click a day to open a Dialog with full task list
- `WorksDoneView` — searchable, filterable archive of completed tasks

### Styling

Tailwind v4 — no config file. `@import "tailwindcss"` in `src/App.css`; `@tailwindcss/vite` plugin in `vite.config.ts`. Radix UI primitives (Dialog, DropdownMenu, Popover, Select) for accessible overlays.

### SQLite database location

macOS: `~/Library/Application Support/com.augustine.todo-tauri/devtodo.db`

### Adding a new Tauri plugin

1. Add the Rust crate to `src-tauri/Cargo.toml`
2. Register it in `src-tauri/src/lib.rs` with `.plugin(...)`
3. Add the required `plugin-name:allow-*` entries to `src-tauri/capabilities/default.json`
4. Install the npm package (`@tauri-apps/plugin-<name>`)
