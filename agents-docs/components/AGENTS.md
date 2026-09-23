# src/components — 布局、表单与卡片

> 父文档：`agents-docs/AGENTS.md`

## 概览

共享 UI 组件层：外壳布局、侧栏、任务行、三个表单对话框与日期选择器。
组件通过 `useStore()` 读写状态，全部用户可见文案走 `useT()`。

## 去哪里找

| 组件 | 作用 |
|---|---|
| `AppLayout.tsx` | 外壳：页头（日期导航、语言切换、视图切换、加任务）、Sidebar、视图路由；挂载三个表单 |
| `Sidebar.tsx` | 项目 / 分类筛选列表 + “全部”；行内 Radix DropdownMenu 编辑 / 删除 |
| `TaskCard.tsx` | **唯一**共享任务行（勾选完成/未完成、优先级点、项目/分类色标、可选截止日期、行内菜单） |
| `TaskForm.tsx` | 新建 / 编辑任务；项目、分类用原生 `<select>`；分类随所选项目联动过滤；常驻挂载 |
| `ProjectForm.tsx` | 新建 / 编辑项目；`PROJECT_COLORS` 色板；由 props `open/item/onClose` 受控 |
| `CategoryForm.tsx` | 新建 / 编辑分类；同色板；可挂到项目 |
| `DatePickerPopover.tsx` | Radix Popover 月历，用于跳转日视图日期 |
| `ui/Dialog.tsx` | **唯一** Radix 封装（`@radix-ui/react-dialog`） |

## 约定（本模块特有）

- **对话框模式**：统一用 `ui/Dialog`，关闭写法 `onOpenChange={(v) => !v && close()}`。`TaskForm` 从 store 读；`ProjectForm` / `CategoryForm` 由 `AppLayout` 传 props。
- **Radix 直用**：仅 Dialog 有封装；`DropdownMenu` 在 `Sidebar.tsx` 与 `TaskCard.tsx` 内联重复（重构候选：抽 `ui/DropdownMenu.tsx`）。
- **无 Radix Select** —— 一律原生 `<select>`。
- 条件类名一律 `cn()`；图标一律 `lucide-react`。
- 组件间无 props 透传链，数据直接取自 store。

## 注意

- `TaskCard` 被 8 处调用，改动影响全部四个视图。
- 优先级配色见 `TaskCard.tsx:14` 的 `PRIORITY_DOT`（low=蓝 / medium=琥珀 / high=红）。
