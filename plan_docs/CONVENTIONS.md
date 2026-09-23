# 工程约束（CONVENTIONS）

> 本文件记录本项目**强约束**。违反前须先取得仓库所有者同意。

## 分支模型

- `main`：上游主分支（朋友的仓库原始分支），仅作参照。
- `dev_cbu`：本项目**主分支**，暂与 `main` 保持一致。
- `dev_cbu_develop`：**开发分支**，日常开发在此进行。
- 流程：`dev_cbu` → 拉出 `dev_cbu_develop` → 在 develop 开发并验证 → 合格后并入 `dev_cbu`。
- 禁止直接在 `main` / `dev_cbu` 上开发。

## 远端（重要）

- ⚠️ 这是**朋友的仓库**：未获明确许可前，**禁止 `git push`**，禁止创建面向远端的 PR。
- 所有提交仅限**本地**；推送需所有者逐次授权。
- 禁止改写已推送历史（`rebase` / `force-push` / `commit --amend` 到已推送提交）。

## 提交

- 未经**明确指示不得提交**（本地提交同样需确认）。
- 信息格式：`<TYPE>(<scope>): <subject>`，一行标题（祈使句），必要时附正文。
- 一次提交只做一件事，不混入无关格式化。

## 代码

- 遵循 `agents-docs/AGENTS.md` 的「约定」与「禁忌」。
- `npx tsc --noEmit` 为**唯一**自动正确性门禁（当前无自动化测试）。
- 禁止 `as any` / `@ts-ignore` 掩盖类型错误。
- 业务逻辑只写在前端 TypeScript；Rust 侧仅做插件注册。

## 文档

- `agents-docs/`、`plan_docs/`、`test_docs/` 集中存放文档，**不得写入源码目录**。
