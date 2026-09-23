# 项目知识库（PROJECT KNOWLEDGE BASE）

> 本文档及 `agents-docs/` 下的全部 AGENTS.md 系列文档**集中存放于本文件夹**，
> 不写入 `src/`、`src-tauri/` 等源码目录（遵循“不改动源码结构”约定）。

**生成时间：** 2026-09-23
**提交：** 801e4fe
**分支：** main

## 概览

DevTodo —— 基于 **Tauri 2 + React 19 + SQLite** 的本地待办应用。
Rust 进程仅负责承载窗口，**全部业务逻辑位于前端 TypeScript**；SQLite 通过
`@tauri-apps/plugin-sql` 以 IPC 方式访问，**没有任何自定义 Rust 命令**。

## 文档索引

| 文档 | 覆盖范围 |
|---|---|
| `agents-docs/AGENTS.md` | 项目总览（本文件） |
| `agents-docs/store/AGENTS.md` | `src/store` — 全局状态与全部动作 |
| `agents-docs/db/AGENTS.md` | `src/db` — SQLite CRUD 与迁移 |
| `agents-docs/components/AGENTS.md` | `src/components` — 布局 / 表单 / 卡片 |
| `agents-docs/views/AGENTS.md` | `src/views` — 四个主视图 |
| `agents-docs/lib/AGENTS.md` | `src/lib` + `src/i18n` + `src/types.ts` |
| `agents-docs/tauri/AGENTS.md` | `src-tauri` — Rust 壳与权限 |

> 相邻文档目录（不在本文件夹内）：`plan_docs/` — 开发计划与工程约束；`test_docs/` — 每个 Feature/issue/bug 的验证文档。三处文档均**不得写入源码目录**。

## 结构

```
devTodo/
├── src/                    # 前端（React 19 + TS + Tailwind v4），应用逻辑全在此
│   ├── components/         # 共享 UI 组件（布局、侧栏、卡片、表单）
│   │   └── ui/             # 仅 Dialog.tsx（唯一的 Radix 封装）
│   ├── db/                 # SQLite CRUD：一表一文件 + 连接单例 + 迁移
│   ├── i18n/               # 手写 zh/en 词典 + date-fns 本地化
│   ├── lib/                # cn() / generateId() / PROJECT_COLORS
│   ├── store/              # 单一 Zustand store（全部状态与动作）
│   ├── views/              # Daily / Weekly / Monthly / WorksDone 四视图
│   ├── App.tsx             # 启动门禁：init() → 加载/报错 → AppLayout
│   └── types.ts            # 共享类型
├── src-tauri/              # Rust 壳（无业务逻辑）
│   ├── src/lib.rs          # 仅注册 opener + sql 插件
│   ├── src/main.rs         # 入口（含 DO NOT REMOVE）
│   └── capabilities/       # default.json —— SQL 权限关键点
└── CLAUDE.md               # 既有约定（命令 + 架构速览）
```

## 去哪里找

| 任务 | 位置 | 说明 |
|---|---|---|
| 改应用状态 / 加动作 | `src/store/index.ts` | 唯一 store；所有读写都走这里 |
| 改 SQL / 加字段 | `src/db/<表>.ts` + `src/db/migrations.ts` | 一表一文件；DDL 集中在迁移 |
| 改某视图渲染 | `src/views/*.tsx` | 纯渲染，数据来自 store |
| 改任务行 UI | `src/components/TaskCard.tsx` | 四个视图共用 |
| 加 Tauri 插件 / 权限 | `src-tauri/`（见 `agents-docs/tauri/AGENTS.md`） | 四步流程 |
| 改文案 / 语言 | `src/i18n/index.ts` | 手写词典，非 i18n 库 |

## 代码图谱

数据流（调用方向）：
`SQLite → src/db/*.ts → src/store/index.ts → views/components`

| 符号 | 类型 | 位置 | 调用方 | 作用 |
|---|---|---|---|---|
| `getDb` | function | `src/db/index.ts:6` | 18 | 连接单例 + 迁移 + FK 开关 |
| `TaskCard` | component | `src/components/TaskCard.tsx:20` | 8 | 四视图共用任务行 |
| `getTasks` | function | `src/db/tasks.ts:4` | 8 | 未完成任务（`status != 'done'`） |
| `openTaskForm` | action | `src/store/index.ts:226` | 6 | 打开任务表单，可预填截止日期 |
| `navigateDate` | action | `src/store/index.ts:100` | 1 | 日/周/月视图日期位移 |
| `getCompletedTasks` | function | `src/db/tasks.ts:11` | — | 已完成任务（`status = 'done'`） |

⚠️ 全仓库无任何测试覆盖，`tsc --noEmit` 是唯一正确性门禁。

## 约定（仅列偏离通用做法者）

- **无 ESLint / Prettier / Biome**：格式随意，但必须通过 `strict` + `noUnusedLocals` + `noUnusedParameters` + `noFallthroughCasesInSwitch`。
- **ESM only**：`"type": "module"`，禁止 `require()`。
- **Tailwind v4 零配置**：没有 `tailwind.config.*` / `postcss`；仅 `src/App.css` 的 `@import "tailwindcss"`。
- **写透（write-through）**：每次变更后从 DB 重新拉取列表再 `set()`，无乐观更新。
- **日期一律 Unix 毫秒整数**：写入用 `Date.now()`；DB 列为 INTEGER。
- **任务双列表同表**：`tasks` 与 `completedTasks` 同源于 `tasks` 表，按 status 分流。
- **对话框由 store 驱动**：`FormState<T> { open, item? }` 三份（task / project / category）。
- **Radix 直用**：仅 Dialog 有封装；DropdownMenu 在 Sidebar / TaskCard 内联重复；Select 用原生 `<select>`。
- **无路径别名**：import 全用相对路径（没有 `@/`）。

## 禁忌（本项目明确禁止）

- ❌ 不要把业务逻辑写进 Rust —— 本仓库 Rust 侧只有插件注册。
- ❌ 不要绕过 store 直接在前端组件调用 `src/db/*` —— 会破坏单一数据源。
- ❌ 不要用 `as any` / `@ts-ignore` 掩盖类型错误（`tsc --noEmit` 是唯一门禁）。
- ❌ 不要把 AGENTS.md 系列文档写入源码目录 —— 统一放 `agents-docs/`。
- ⚠️ **删了会挂的模块级高危项**：`src-tauri` 的 SQL 权限、`src/db` 的 `PRAGMA foreign_keys` —— 详见 `agents-docs/tauri/AGENTS.md` 与 `agents-docs/db/AGENTS.md`。

## 命令

```bash
bun run tauri dev     # 开发（Tauri 窗口 + HMR）
bunx tsc --noEmit     # 类型检查（唯一正确性门禁）
bun run dev           # 纯前端开发
bun run tauri build   # 生产构建
```

## 注意事项

- 开发端口固定 **1420**（`strictPort`），`tauri.conf.json` 硬编码 `http://localhost:1420`；改端口会破坏 `tauri dev`。
- store 底部有 HMR 钩子（`import.meta.hot.accept`），热重载会重跑 `init()` 重新查库。
- 语言默认 **中文（`zh`）**，存于 `localStorage.locale`。
- `.codegraph/`、`.omo/`、`.opencode/` 为工具产物（非源码），已在仓库 `.gitignore` 中忽略。
- SQLite 文件 `devtodo.db` 已被 `.gitignore`（`*.db`）忽略；macOS 位于 `~/Library/Application Support/com.augustine.todo-tauri/`。
