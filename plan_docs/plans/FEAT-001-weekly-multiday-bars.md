# FEAT-001: 周视图跨天任务色块（开始 → 截止）

- **状态**：draft
- **类型**：FEAT
- **分支**：dev_cbu_develop
- **关联验证**：test_docs/cases/FEAT-001-weekly-multiday-bars.md
- **创建**：2026-09-23

## 背景 / 问题

- 现状：周视图仅把任务渲染在 `due_date` 当天列（`WeeklyView.tsx:35-37`），跨天任务在中间几天"消失"。
- `Task` 无"开始日期"字段（`types.ts:21-32`），无法表达"从开始到截止"的区间。
- 期望：任务从开始日到截止日**连续显示为一条色块横条**；时间重叠的任务**分泳道**且**颜色可区分**。

## 目标

- 同时有 `start_date` 与 `due_date` 的任务，在周视图中渲染为跨列色块 `[start, due]`（含两端）。
- 重叠色块自动错行（泳道），互不遮挡。
- 色块颜色 = 项目色 > 分类色 > 灰；带标题文字与描边，保证同色也可区分。
- 未填 `start_date` 的任务，行为与改动前**完全一致**。

## 范围

- **包含**：版本化迁移（合并 ISSUE-004）、`tasks.start_date` 列、`Task` 类型、`TaskForm` 开始日期输入（新建默认今天）、`WeeklyView` 色块渲染、i18n 文案。
- **不包含**：月视图色块（后续独立评估）、日视图改动、提醒/通知、拖动调整区间。

## 设计

### 1) 数据模型

- `Task` 新增 `start_date: number | null`（Unix 毫秒，取本地日 00:00）。
- 边界规则：

| 情况 | 行为 |
|---|---|
| start & due | 色块 `[start, due]` |
| 仅 due | 单日，现状（列内卡片） |
| 仅 start | 不进周视图（周视图只显示有 due 的任务，现状如此） |
| 都无 | 不进周视图 |
| start > due | 视作单日落在 due；表单另加校验阻止 |

### 2) 迁移版本化（合并 ISSUE-004）

- `migrations.ts` 改为**有序数组，索引即目标版本**：
  - `[0]`：建表（projects / categories / tasks）
  - `[1]`：`ALTER TABLE tasks ADD COLUMN start_date INTEGER`
- `getDb()`：读 `PRAGMA user_version` → 从当前版本起逐条执行未应用的迁移 → 成功后 `PRAGMA user_version = migrations.length`。
- **兼容**：老库 `user_version=0` → 重跑 `CREATE TABLE IF NOT EXISTS`（幂等）→ 执行 ALTER → 置版本；新库同理。
- **实现前先实测**：sqlx 对 `PRAGMA user_version` 读/写的支持方式（`select` vs `execute`）。

### 3) 数据层 `db/tasks.ts`

- `createTask` / `updateTask` 的 INSERT / UPDATE 增加 `start_date` 绑定；`SELECT *` 自动带出新列。

### 4) 表单 `TaskForm.tsx`

- 新增"开始日期" `<input type="date">`（可空）。
- **新建**：默认 `start_date = 今天`（可改、可清）；**编辑**：取任务现值。
- 提交：`start_date = 输入 ? 本地日 00:00 毫秒 : null`。
- 校验：两者都有且 `start > due` → 阻止提交并提示（i18n）。

### 5) 周视图 `WeeklyView.tsx`

- 单日任务（无 start 或 start == due）：维持现状列内卡片。
- 跨天任务：在 7 列网格上叠加"色块层"：
  - 列定位：由 start 的列索引 + 跨列数确定；与周边界求交（clamp）；完全在周外则丢弃。
  - 泳道：按 start 升序，贪心放入首个不重叠泳道。
  - 交互：点击色块 → `openTaskForm(task)`。
  - 视觉：背景 `color+"20"`、文字/描边 `color`、标题 truncate。

### 6) i18n

- 新增键（zh / en）：`startDate`（开始日期）、`startAfterDue`（开始日期不能晚于截止日期）等。

## 验收标准

- [ ] 新建任务 start=今天、due=+5 天 → 周视图连续色块，跨 6 列。
- [ ] 两个时间重叠的任务 → 上下两泳道、颜色区分、均完整可见。
- [ ] 不填 start 的任务 → 行为与改动前一致。
- [ ] 已有数据库升级：数据不丢、`user_version` 正确递增、二次启动不报错（幂等）。
- [ ] `start > due` → 表单阻止提交并提示。
- [ ] `bunx tsc --noEmit` exit 0。

## 风险与回滚

- **迁移风险**：ALTER / 版本号出错 → 先备份 `devtodo.db`（复制文件）再执行；回滚 = 从备份恢复（SQLite 不能删列）。
- **PRAGMA 兼容**：`user_version` 经 sqlx 的读写方式未验证 → 先做最小实测再全量改。
- **布局复杂度**：跨列定位 + 泳道易出视觉问题 → 先做可预测的静态实现，避免动画。
