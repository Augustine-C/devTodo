# 开发路线图（ROADMAP）

> 图例：`todo` / `doing` / `done` / `dropped`
> 每项实施前：在 `plans/` 建同名计划，在 `test_docs/cases/` 建同名验证文档。

## 阶段 0 — 基建（当前）

- [ ] 建立分支模型（`dev_cbu` / `dev_cbu_develop`）
- [ ] 建立文档骨架（`agents-docs` / `plan_docs` / `test_docs`）
- [ ] 首次 `bun install` 并跑通 `bunx tsc --noEmit` 基线

## 阶段 1 — 正确性优先

| ID | 项 | 证据 | 状态 |
|---|---|---|---|
| BUG-001 | 编辑表单切换状态时 `completed_at` 不同步 | `TaskForm.tsx:66-75`、`db/tasks.ts:33`、`WorksDoneView.tsx:28` | todo |
| BUG-002 | `removeProject` 不刷新 categories（幽灵分类） | `store/index.ts:131-145` | todo |
| BUG-003 | `removeCategory` 不重置 `selectedCategoryId` | `store/index.ts:165-173` | todo |
| ISSUE-001 | `getDb` 缓存已解析值而非 in-flight promise（启动竞态） | `db/index.ts:6-14` | todo |

## 阶段 2 — 可靠性与性能

| ID | 项 | 证据 | 状态 |
|---|---|---|---|
| ISSUE-002 | 变更操作零错误处理 + 提交期间禁用 | `store/index.ts` 各 action | todo |
| ISSUE-003 | `useStore` 全量订阅改 selector | 11 处裸 `useStore()` | todo |
| ISSUE-004 | 引入迁移版本机制（`PRAGMA user_version`） | `db/migrations.ts` | todo |
| ISSUE-005 | 硬编码 `86400000` 日窗（DST 敏感） | `DailyView.tsx:15` | todo |

## 阶段 3 — 工程化

| ID | 项 | 状态 |
|---|---|---|
| CHORE-001 | 引入 Vitest + 首批单测（状态迁移 / 日期分桶） | todo |
| CHORE-002 | 清理死代码 / 死依赖 / 死插件 | todo |
| CHORE-003 | 设置 CSP + 收敛 SQL 权限 | todo |
| CHORE-004 | a11y：Dialog `Description`、图标按钮 `aria-label` | todo |
