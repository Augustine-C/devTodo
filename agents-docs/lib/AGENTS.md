# src/lib + src/i18n + src/types.ts — 工具、国际化与类型

> 父文档：`agents-docs/AGENTS.md`

## 概览

跨模块支撑层：通用工具、手写双语词典、共享类型。

## 去哪里找

| 文件 | 导出 |
|---|---|
| `src/lib/utils.ts` | `cn()`（clsx + tailwind-merge）、`generateId()`（`crypto.randomUUID`）、`PROJECT_COLORS`（12 个 hex） |
| `src/i18n/index.ts` | `useT()`（取文案）、`useDateLocale()`（date-fns 的 zhCN / enUS）、`Locale = "zh" \| "en"`、zh/en 词典 |
| `src/types.ts` | `Project` / `Category` / `Task` / `Priority` / `TaskStatus` / `View` |

## 约定（本模块特有）

- **非 i18n 库**：手写词典对象，按组件分区；新增文案须同时补 zh 与 en。
- 语言默认 `zh`，存于 `localStorage.locale`，经 store 读写。
- 合并类名一律 `cn()`；生成 ID 一律 `generateId()`。
- 类型取值：`Priority = "low" | "medium" | "high"`；`TaskStatus = "todo" | "in_progress" | "done"`；`View = "daily" | "weekly" | "monthly" | "done"`。

## 注意

- 词典为手写，缺键 / 拼写错误不会在类型层面报错（`useT()` 返回对象）；改文案需自行核对两语。
- `PROJECT_COLORS` 被 Project / Category 两个表单复用，改色板会影响两处。
