# src/store — 全局状态与动作

> 父文档：`agents-docs/AGENTS.md`

## 概览

单一 Zustand store（`src/store/index.ts`，约 221 行），承载**全部**应用状态与动作，
是前端唯一的数据入口，被 11 个文件导入。

## 状态字段

- **数据**：`projects` / `categories` / `tasks`（未完成）/ `completedTasks`（已完成）
- **导航**：`activeView` / `currentDate` / `selectedProjectId` / `selectedCategoryId`
- **偏好**：`locale`
- **表单**：`taskForm` / `projectForm` / `categoryForm`，均为 `FormState<T> { open, item? }`

## 去哪里找

| 任务 | 位置 |
|---|---|
| 首次加载 / 重新查库 | `init()` |
| 增删改任务 | `addTask` / `editTask` / `removeTask` / `markDone` / `markTodo` |
| 打开任务表单（可预填日期） | `openTaskForm(task?, defaultDate?)` |
| 日期位移（日/周/月） | `navigateDate(dir)` |
| 选中项目 / 分类 | `setSelectedProject` / `setSelectedCategory` |

## 约定（本模块特有）

- **写透模式**：每个 action 先 `await` 对应 `db` 调用，再 `Promise.all` 重取列表并 `set()`。新增 action 沿用此模式。
- **表单打开约定**：视图通过 `openTaskForm(undefined, dayStartMs)` 为某一天新建任务并预填 `due_date`；`TaskForm` 常驻挂载、从 store 读 `taskForm`。`ProjectForm` / `CategoryForm` 则由 `AppLayout` 以 props 受控。
- **筛选联动**：选中项目会清空 `selectedCategoryId`，反之亦然。
- `openTaskForm` 的占位任务使用 `created_at: 0`。
- **HMR 钩子**：文件底部 `import.meta.hot.accept(() => useStore.getState().init())`，热重载重新查库（有意为之，勿删）。

## 注意

- store 对 `i18n` 的依赖是 `import type { Locale }`（类型专用，编译期擦除）；运行时方向为 `i18n → store`，无循环。
- 视图**不得**绕过 store 直接调用 `src/db/*`。
