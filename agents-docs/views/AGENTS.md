# src/views — 四个主视图

> 父文档：`agents-docs/AGENTS.md`

## 概览

四个纯渲染视图，全部经 `useStore()` 读取状态、以 `TaskCard` 渲染任务行，
不直接访问 db 层。

## 去哪里找

| 视图 | 文件 | 行为 |
|---|---|---|
| 日 | `DailyView.tsx` | 累积式：今日到期 → 逾期 → 未来（按天分组）→ 无日期 → 今日已完成 |
| 周 | `WeeklyView.tsx` | 7 个 `DayColumn`（周一~周日，`weekStartsOn: 1`），今日列高亮 |
| 月 | `MonthlyView.tsx` | 日历网格；格内最多 3 个 `TaskPill` + “+N”；点某天开 Dialog 列全部 |
| 已完成 | `WorksDoneView.tsx` | 可搜索 / 按项目·分类筛选的归档；按 `completed_at` 天分组、倒序 |

## 约定（本模块特有）

- **筛选谓词四视图内联重复**：`selectedProjectId` / `selectedCategoryId` 判断逐处复制（重构候选：抽 `useFilteredTasks()`）。
- **排序来自 DB**：未完成 `due_date ASC, created_at ASC`；已完成 `completed_at DESC`。视图仅做内存分桶。
- **本地小组件**：`Section`（DailyView）、`DayColumn`（WeeklyView）、`TaskPill`（MonthlyView）均为文件内私有，不跨文件共享。
- 日期运算统一 `date-fns`，以周一为一周起始。
- 颜色渲染：`color + "20"` 或 `+ "18"` 作背景淡色，原 hex 作前景。

## 注意

- `DailyView.tsx:15` 用硬编码 `86400000` 毫秒计算当天窗口（对夏令时敏感）。
- `WorksDoneView.tsx:28` 在 `completed_at` 为空时回退 `new Date()` —— 会把该任务误归到“今天”。
