# test_docs — 验证文档

> 用途：记录**每个 Feature / issue / bug 如何验证**。与 `plan_docs/` 一一对应。
> 现状：**无自动化测试**，`npx tsc --noEmit` 是唯一门禁；验证以**手动步骤 + 预期结果**为主（见 `TEST_STRATEGY.md`）。

## 目录结构

```
test_docs/
├── AGENTS.md         # 本文件：索引与命名规范
├── TEST_STRATEGY.md  # 测试策略与门禁分层
├── REGRESSION.md     # 通用回归清单
└── cases/            # 单项验证文档（一事一文件）
    └── TEMPLATE.md   # 验证模板（复制后改名）
```

## 命名规范

- 验证文件：`cases/<TYPE>-<NNN>-<slug>.md`，**与 `plan_docs/plans/` 同名**。
- 示例：`cases/BUG-001-completed-at-lifecycle.md`

## 约定

- 每条用例含：前置条件、步骤、预期结果、实际结果、结论（`pass` / `fail`）。
- 时间/数值断言须写明边界（当日、DST、空值、跨天）。
- 缺陷修复须附**可复现的最小步骤**与修复后的对照验证。
