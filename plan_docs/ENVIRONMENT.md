# 开发环境（ENVIRONMENT）

> 记录跑通 `bun run tauri dev` 所需的系统环境与网络镜像配置。属环境约定，非代码。

## 必需组件（Windows x64）

| 组件 | 版本 | 用途 |
|---|---|---|
| Rust 工具链 | rustc / cargo 1.98.1，`stable-x86_64-pc-windows-msvc` | 编译 Tauri 后端 |
| MSVC 链接器 | VS 生成工具 2022（VCTools 工作负载） | Rust Windows 链接必需 |
| WebView2 Runtime | 153.0.4234.48 | Tauri 运行时 |
| bun | 1.4.2 | **唯一**包管理器 |

> IDE（如 RustRover / VS Code）**不提供**编译器与 MSVC 链接器，不是必需项。

## 安装要点

- **rustup**：`winget install Rustlang.Rustup` 在非交互终端会失败（`rustup-init` 缺 `-y`，读 stdin 失败）。改用官方 `rustup-init.exe -y`，或在交互式终端运行 winget。
- **VS Build Tools**（需管理员）：

  ```
  winget install Microsoft.VisualStudio.2022.BuildTools --override "--wait --quiet --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
  ```

- 安装后如提示重启，建议重启一次。

## 国内网络镜像（重要）

`static.rust-lang.org/dist` 常被网络阻断。已将以下**用户环境变量**持久化：

```
RUSTUP_DIST_SERVER = https://rsproxy.cn
RUSTUP_UPDATE_ROOT = https://rsproxy.cn/rustup
```

- 拉取 / 更新工具链：`rustup default stable`、`rustup update`。
- `index.crates.io` 经测可达；如需加速可另配 `~/.cargo/config.toml` 的 crates 镜像（可选）。

## 验证

```
bun run tauri info     # MSVC / rustc / cargo / rustup / toolchain 应全为 ✔
bunx tsc --noEmit      # 期望 exit 0
```
