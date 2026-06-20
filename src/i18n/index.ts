import { zhCN, enUS } from "date-fns/locale";
import { useStore } from "../store";

export type Locale = "zh" | "en";

const en = {
  // Nav
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  done: "Done",
  todayBtn: "Today",
  addTask: "Task",

  // Sidebar
  allTasks: "All tasks",
  projects: "Projects",
  categories: "Categories",
  noProjects: "No projects yet",
  noCategories: "No categories yet",
  edit: "Edit",
  delete: "Delete",

  // DailyView
  dueToday: "Due today",
  dueDateFmt: "Due",
  noTasksDueToday: "No tasks due today",
  overdueLabel: (n: number) => `Overdue · ${n}`,
  doneTodayLabel: (n: number) => `Done today · ${n}`,
  noDate: "No due date",

  // WeeklyView
  weekOfLabel: (start: string, end: string) => `Week of ${start} – ${end}`,

  // WorksDoneView
  worksDone: "Works Done",
  completedCount: (n: number) => `${n} completed`,
  searchPlaceholder: "Search completed tasks…",
  allProjects: "All projects",
  allCategories: "All categories",
  noCompletedTasks: "No completed tasks yet",

  // TaskCard
  taskEdit: "Edit",
  taskDelete: "Delete",

  // TaskForm
  newTask: "New task",
  editTask: "Edit task",
  taskTitlePlaceholder: "Task title",
  descriptionPlaceholder: "Description (optional)",
  project: "Project",
  noProject: "No project",
  category: "Category",
  noCategory: "No category",
  dueDate: "Due date",
  priority: "Priority",
  status: "Status",
  low: "Low",
  medium: "Medium",
  high: "High",
  todo: "To Do",
  inProgress: "In Progress",
  doneStatus: "Done",
  cancel: "Cancel",
  save: "Save",
  addTaskBtn: "Add task",

  // ProjectForm
  newProject: "New project",
  editProject: "Edit project",
  name: "Name",
  projectNamePlaceholder: "Project name",
  color: "Color",
  descriptionOptional: "Description (optional)",
  shortDescriptionPlaceholder: "Short description",
  create: "Create",

  // CategoryForm
  newCategory: "New category",
  editCategory: "Edit category",
  categoryNamePlaceholder: "Category name",
  projectOptional: "Project (optional)",

  // DatePickerPopover
  jumpToToday: "Jump to today",

  // MonthlyView
  weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as string[],
  addTaskForDay: "+ Add task for this day",
  moreCount: (n: number) => `+${n} more`,

  // AppLayout date labels
  weekOfFmt: "'Week of' MMM d",
};

const zh: typeof en = {
  // Nav
  daily: "日视图",
  weekly: "周视图",
  monthly: "月视图",
  done: "已完成",
  todayBtn: "今天",
  addTask: "任务",

  // Sidebar
  allTasks: "全部任务",
  projects: "项目",
  categories: "分类",
  noProjects: "暂无项目",
  noCategories: "暂无分类",
  edit: "编辑",
  delete: "删除",

  // DailyView
  dueToday: "今日到期",
  dueDateFmt: "到期",
  noTasksDueToday: "今日暂无到期任务",
  overdueLabel: (n: number) => `已逾期 · ${n}`,
  doneTodayLabel: (n: number) => `今日完成 · ${n}`,
  noDate: "无截止日期",

  // WeeklyView
  weekOfLabel: (start: string, end: string) => `${start} – ${end}`,

  // WorksDoneView
  worksDone: "完成记录",
  completedCount: (n: number) => `共完成 ${n} 项`,
  searchPlaceholder: "搜索已完成任务…",
  allProjects: "全部项目",
  allCategories: "全部分类",
  noCompletedTasks: "暂无已完成任务",

  // TaskCard
  taskEdit: "编辑",
  taskDelete: "删除",

  // TaskForm
  newTask: "新建任务",
  editTask: "编辑任务",
  taskTitlePlaceholder: "任务标题",
  descriptionPlaceholder: "描述（可选）",
  project: "项目",
  noProject: "无项目",
  category: "分类",
  noCategory: "无分类",
  dueDate: "截止日期",
  priority: "优先级",
  status: "状态",
  low: "低",
  medium: "中",
  high: "高",
  todo: "待办",
  inProgress: "进行中",
  doneStatus: "已完成",
  cancel: "取消",
  save: "保存",
  addTaskBtn: "添加任务",

  // ProjectForm
  newProject: "新建项目",
  editProject: "编辑项目",
  name: "名称",
  projectNamePlaceholder: "项目名称",
  color: "颜色",
  descriptionOptional: "描述（可选）",
  shortDescriptionPlaceholder: "简短描述",
  create: "创建",

  // CategoryForm
  newCategory: "新建分类",
  editCategory: "编辑分类",
  categoryNamePlaceholder: "分类名称",
  projectOptional: "所属项目（可选）",

  // DatePickerPopover
  jumpToToday: "跳转至今天",

  // MonthlyView
  weekdays: ["一", "二", "三", "四", "五", "六", "日"],
  addTaskForDay: "+ 添加任务",
  moreCount: (n: number) => `+${n} 更多`,

  // AppLayout date labels (not used as format string in zh mode)
  weekOfFmt: "M月d日",
};

const translations = { en, zh };

export function useT() {
  const locale = useStore((s) => s.locale);
  return translations[locale];
}

export function useDateLocale() {
  const locale = useStore((s) => s.locale);
  return locale === "zh" ? zhCN : enUS;
}
