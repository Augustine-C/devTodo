# src-tauri — Rust 壳与权限

> 父文档：`agents-docs/AGENTS.md`

## 概览

Tauri 2 后端仅承载窗口并注册插件，**零自定义命令**；应用逻辑全在前端。

## 去哪里找

| 文件 | 作用 |
|---|---|
| `src/lib.rs` | `run()`：`tauri::Builder` 注册 `tauri-plugin-opener` + `tauri-plugin-sql`（sqlite） |
| `src/main.rs` | 入口：调用 `todo_tauri_lib::run()` |
| `capabilities/default.json` | 权限声明：`core:default`、`opener:default`、`sql:allow-load/execute/select/close` |
| `tauri.conf.json` | 窗口（DevTodo，1100×720）、`devUrl :1420`、`frontendDist ../dist`、`csp: null` |
| `Cargo.toml` | lib 名 `todo_tauri_lib`；依赖 tauri 2 + plugin-opener + plugin-sql |

## 约定（本模块特有）

- **新增插件四步**：① `Cargo.toml` 加 crate ② `lib.rs` 加 `.plugin(...)` ③ `capabilities/default.json` 加 `plugin:allow-*` ④ 用 `bun add` 安装对应的 `@tauri-apps/plugin-*` 包。
- 窗口标识 `main`；`csp: null`（无 CSP 限制）。

## 注意

- **`capabilities/default.json` 的四个 `sql:allow-*` 缺一不可**，否则应用卡在 “Loading...”。
- `main.rs:1` 的 `windows_subsystem` 属性标有 `DO NOT REMOVE`，删除会在 Windows release 弹出控制台。
- `Cargo.toml` 的 lib 名带 `_lib` 后缀，用于避免 Windows 上 bin/lib 同名冲突，勿改。
