# plan_docs — 开发计划与约束

> 用途：集中存放**开发计划**与**工程约束**，与源码分离（不写入 `src/`、`src-tauri/`）。
> 关联文档：`agents-docs/`（项目知识库）、`test_docs/`（验证文档）。

## 目录结构

```
plan_docs/
├── AGENTS.md        # 本文件：索引与命名规范
├── CONVENTIONS.md   # 工程约束（分支 / 提交 / 远端 / 评审 / 代码）
├── ROADMAP.md       # 里程碑与待办优先级
└── plans/           # 单项开发计划（一事一文件）
    └── TEMPLATE.md  # 计划模板（复制后改名）
```

## 命名规范

- 计划文件：`plans/<TYPE>-<NNN>-<slug>.md`
- `TYPE` ∈ `{ FEAT, ISSUE, BUG, CHORE }`
  - `FEAT` 新功能 · `ISSUE` 问题/改进 · `BUG` 缺陷 · `CHORE` 杂务/重构
- `NNN`：三位序号（`001` 起）。
- `slug`：英文小写短横线，如 `completed-at-lifecycle`。
- 示例：`plans/BUG-001-completed-at-lifecycle.md`
- ⚠️ **同一 ID 必须在 `test_docs/cases/` 有同名验证文档**（一一对应，见 `test_docs/AGENTS.md`）。

## 约定

- 一个计划 = 一个可独立验证的交付单元；必须含：目标、范围、验收标准、风险。
- 状态取值：`draft` / `approved` / `in-progress` / `done` / `dropped`，标于文件顶部。
- 先评审后实施；实施完毕回填状态，并在对应 `test_docs` 案例记录结论。
- 新增条目先登记到 `ROADMAP.md`，再建独立计划文件。
