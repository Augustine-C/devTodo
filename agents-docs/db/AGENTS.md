# src/db — SQLite 数据访问

> 父文档：`agents-docs/AGENTS.md`

## 概览

前端直连 SQLite（`@tauri-apps/plugin-sql` IPC），无 Rust 命令。命名惯例“一表一文件”，
另有连接单例与迁移两个非表文件。

## 去哪里找

| 文件 | 作用 |
|---|---|
| `index.ts` | `getDb()` 连接单例：`Database.load("sqlite:devtodo.db")` → 逐条执行迁移 → `PRAGMA foreign_keys = ON` |
| `migrations.ts` | DDL 数组（`CREATE TABLE IF NOT EXISTS` × 3：projects / categories / tasks） |
| `tasks.ts` | 任务 CRUD + `markTaskDone` / `markTaskTodo` |
| `projects.ts` | 项目 CRUD |
| `categories.ts` | 分类 CRUD |

## 约定（本模块特有）

- **日期为 Unix 毫秒整数**：写入用 `Date.now()`，列类型 INTEGER。
- **任务查询分流**：`getTasks()` = `status != 'done'`；`getCompletedTasks()` = `status = 'done'`。
- **表名 / 列名 snake_case**，与 `src/types.ts` 字段一一对应。
- **DDL 只加在 `migrations.ts`**（`CREATE TABLE IF NOT EXISTS`，首次打开即执行）。

## 注意

- 级联依赖 `PRAGMA foreign_keys = ON`（`index.ts:12`）：删除 projects → categories 级联删除、tasks 置空。**勿删此行**。
- `CHECK` 约束锁定取值：`priority IN ('low','medium','high')`、`status IN ('todo','in_progress','done')`；新增取值必须写迁移。
- `markTaskTodo` 会把 `completed_at` 置 NULL；`updateTask` 直接写传入的 `completed_at`。
- 连接为进程内单例，只在首次 `getDb()` 时建表。
