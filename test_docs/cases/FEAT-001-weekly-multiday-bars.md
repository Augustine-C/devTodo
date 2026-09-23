# FEAT-001: 周视图跨天任务色块 — 手动验证指南

- **计划**：plan_docs/plans/FEAT-001-weekly-multiday-bars.md
- **状态**：待人工验证（机器验证已通过，见文末「已验证项」）
- **更新**：2026-09-23

## 0. 准备

```powershell
cd E:\programee\devTodo
bun install            # 若依赖未装
bun run tauri dev      # 启动开发窗口（首次编译较慢，之后 ~20s）
```

- 用**开发版窗口**测试，不要用已安装的旧成品（旧版不认 `start_date`，不会画色块）。
- 至少准备 **2 个不同颜色**的项目（侧栏「项目 +」新建）；没有也没关系，用分类色或灰色也能测。

## 1. 核心用例（看窗口）

### T1 — 跨天色块出现
1. 点顶部 **「+ 任务」**
2. 标题 `跨度测试`；**开始日期 = 今天**；**截止日期 = 今天 +5 天**；项目选「数据平台」
3. 点「添加任务」→ 切到 **「周视图」**

**期望**：出现一条**连续色块**，从"今天"所在列一直连到"+5 天"所在列（同一周内则跨 6 列；若跨周末则分属两周，用 `>` 导航查看）；色块颜色 = 项目色；块上显示 `跨度测试`。

### T2 — 重叠任务分泳道
1. 再建任务：标题 `重叠测试`；**开始 = 今天 +2 天**，**截止 = 今天 +7 天**；项目选**另一个颜色**
2. 回「周视图」

**期望**：两条色块**上下分成两行（泳道）**、互不遮挡、颜色不同、标题都能看清。

### T3 — 单日任务不受影响（回归）
1. 新建任务：只填 **截止日期 = 明天**，**开始日期留空**
2. 回「周视图」

**期望**：该任务仍以**卡片**形式显示在"明天"那一列里（与改动前**完全一致**），**不画色块**。

### T4 — 点击色块可编辑
1. 点击 T1 的色块

**期望**：打开「编辑任务」弹窗，**开始 / 截止日期已预填**为原值。

### T5 — 开始晚于截止被拦截
1. 新建或编辑任务
2. **开始日期 = 2026/10/10**，**截止日期 = 2026/10/01**

**期望**：点「添加/保存」**不提交**，下方出现红色提示 **「开始日期不能晚于截止日期」**。

### T6 — 跨周裁剪
1. 建任务：开始 = **上周**某天，截止 = **本周**某天
2. 回「周视图」

**期望**：色块左端被**裁剪到本周一**，不溢出到上一周。

## 2. 迁移正确性（命令行，可选）

已由机器验证；如需自测，用 bun 读 SQLite。将下面脚本存为 `check-db.ts`：

```ts
import { Database } from "bun:sqlite";
const db = new Database(process.argv[2], { readonly: true });
console.log("user_version =", db.query("PRAGMA user_version").get());
console.log("columns =", db.query("PRAGMA table_info(tasks)").all().map((c) => c.name).join(", "));
console.log("count =", db.query("SELECT COUNT(*) n FROM tasks").get());
```

```powershell
bun run check-db.ts "$env:APPDATA\com.augustine.todo-tauri\devtodo.db"
```

**期望**：`user_version = 2`；`columns` 含 `start_date`；`count` 与升级前一致（数据不丢）。

## 3. 回归清单

- [ ] 日视图 / 月视图 / 已完成视图 正常
- [ ] 周视图里项目 / 分类筛选生效（色块也随之过滤）
- [ ] 勾选完成 / 取消完成 正常
- [ ] 关闭应用再重开：正常启动、无报错（迁移幂等）
- [ ] `bunx tsc --noEmit` exit 0

## 4. 结果记录

| 用例 | 结论（pass/fail） | 备注 |
|---|---|---|
| T1 跨天色块 | | |
| T2 分泳道 | | |
| T3 单日回归 | | |
| T4 点击编辑 | | |
| T5 校验 | | |
| T6 跨周裁剪 | | |

## 5. 已验证项（机器，2026-09-23）

- `bunx tsc --noEmit` → exit 0
- 迁移：`user_version 0 → 2`，`tasks` 新增 `start_date`，**7 条任务数据完好**
- 二次启动：**幂等**，无错误，`user_version` 保持 2
- 应用启动：`Running todo-tauri.exe`，窗口 `DevTodo` 响应正常
- 备份：`%APPDATA%\com.augustine.todo-tauri\devtodo.db.bak-*`（迁移前）
