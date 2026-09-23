# 测试策略（TEST STRATEGY）

## 现状

- 无自动化测试；`bunx tsc --noEmit` 是唯一自动门禁。
- 应用为本地 Tauri + SQLite，UI 手动验证成本低——覆盖关键路径即可。

## 门禁分层

| 层级 | 手段 | 何时 | 强制 |
|---|---|---|---|
| L1 类型 | `bunx tsc --noEmit` | 每次改动 | 是 |
| L2 手动验收 | 本文档 `cases/` | 每个 FEAT/ISSUE/BUG | 是 |
| L3 自动化单测 | Vitest（待引入） | 纯函数 / 日期分桶 / 状态迁移 | 计划中 |
| L4 构建 | `bun run tauri build` | 发版前 | 是（发版时） |

## 引入 Vitest 后首批覆盖

1. 状态 → `completed_at` 迁移（BUG-001）
2. 日期分桶与日窗（DST / 硬编码 `86400000`）
3. day / week / month 视图的过滤谓词

## 环境

- 首次需 `bun install`（当前克隆尚无 `node_modules`）。
- 冒烟：`bun run tauri dev` → 窗口出现、不卡 “Loading...”。
