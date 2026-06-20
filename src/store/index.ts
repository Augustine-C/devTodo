import { create } from "zustand";
import type { Project, Category, Task, View } from "../types";
import { generateId } from "../lib/utils";
import * as projectsDb from "../db/projects";
import * as categoriesDb from "../db/categories";
import * as tasksDb from "../db/tasks";

interface FormState<T> {
  open: boolean;
  item?: T;
}

interface AppStore {
  projects: Project[];
  categories: Category[];
  tasks: Task[];
  completedTasks: Task[];

  activeView: View;
  selectedProjectId: string | null;
  selectedCategoryId: string | null;
  currentDate: Date;

  taskForm: FormState<Task>;
  projectForm: FormState<Project>;
  categoryForm: FormState<Category>;

  init: () => Promise<void>;
  setActiveView: (view: View) => void;
  setSelectedProject: (id: string | null) => void;
  setSelectedCategory: (id: string | null) => void;
  navigateDate: (direction: -1 | 1) => void;
  goToToday: () => void;
  setCurrentDate: (date: Date) => void;

  addProject: (name: string, color: string, description?: string) => Promise<void>;
  editProject: (project: Project) => Promise<void>;
  removeProject: (id: string) => Promise<void>;

  addCategory: (name: string, color: string, projectId?: string | null) => Promise<void>;
  editCategory: (category: Category) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;

  addTask: (data: Omit<Task, "id" | "created_at" | "completed_at">) => Promise<void>;
  editTask: (task: Task) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  markDone: (id: string) => Promise<void>;
  markTodo: (id: string) => Promise<void>;
  refreshCompleted: () => Promise<void>;

  openTaskForm: (task?: Task, defaultDate?: number | null) => void;
  closeTaskForm: () => void;
  openProjectForm: (project?: Project) => void;
  closeProjectForm: () => void;
  openCategoryForm: (category?: Category) => void;
  closeCategoryForm: () => void;
}

export const useStore = create<AppStore>((set, get) => ({
  projects: [],
  categories: [],
  tasks: [],
  completedTasks: [],

  activeView: "daily",
  selectedProjectId: null,
  selectedCategoryId: null,
  currentDate: new Date(),

  taskForm: { open: false },
  projectForm: { open: false },
  categoryForm: { open: false },

  async init() {
    const [projects, categories, tasks, completedTasks] = await Promise.all([
      projectsDb.getProjects(),
      categoriesDb.getCategories(),
      tasksDb.getTasks(),
      tasksDb.getCompletedTasks(),
    ]);
    set({ projects, categories, tasks, completedTasks });
  },

  setActiveView: (activeView) => set({ activeView }),

  setSelectedProject: (selectedProjectId) =>
    set({ selectedProjectId, selectedCategoryId: null }),

  setSelectedCategory: (selectedCategoryId) => set({ selectedCategoryId }),

  navigateDate(direction) {
    const { currentDate, activeView } = get();
    const d = new Date(currentDate);
    if (activeView === "daily") d.setDate(d.getDate() + direction);
    else if (activeView === "weekly") d.setDate(d.getDate() + direction * 7);
    else if (activeView === "monthly") d.setMonth(d.getMonth() + direction);
    set({ currentDate: d });
  },

  goToToday: () => set({ currentDate: new Date() }),

  setCurrentDate: (date) => set({ currentDate: date }),

  async addProject(name, color, description) {
    const project: Omit<Project, "created_at"> = {
      id: generateId(),
      name,
      color,
      description: description ?? null,
    };
    await projectsDb.createProject(project);
    const projects = await projectsDb.getProjects();
    set({ projects });
  },

  async editProject(project) {
    await projectsDb.updateProject(project);
    const projects = await projectsDb.getProjects();
    set({ projects });
  },

  async removeProject(id) {
    await projectsDb.deleteProject(id);
    const [projects, tasks, completedTasks] = await Promise.all([
      projectsDb.getProjects(),
      tasksDb.getTasks(),
      tasksDb.getCompletedTasks(),
    ]);
    const { selectedProjectId } = get();
    set({
      projects,
      tasks,
      completedTasks,
      selectedProjectId: selectedProjectId === id ? null : selectedProjectId,
    });
  },

  async addCategory(name, color, projectId) {
    const category: Omit<Category, "created_at"> = {
      id: generateId(),
      name,
      color,
      project_id: projectId ?? null,
    };
    await categoriesDb.createCategory(category);
    const categories = await categoriesDb.getCategories();
    set({ categories });
  },

  async editCategory(category) {
    await categoriesDb.updateCategory(category);
    const categories = await categoriesDb.getCategories();
    set({ categories });
  },

  async removeCategory(id) {
    await categoriesDb.deleteCategory(id);
    const [categories, tasks, completedTasks] = await Promise.all([
      categoriesDb.getCategories(),
      tasksDb.getTasks(),
      tasksDb.getCompletedTasks(),
    ]);
    set({ categories, tasks, completedTasks });
  },

  async addTask(data) {
    const task: Omit<Task, "created_at" | "completed_at"> = {
      id: generateId(),
      ...data,
    };
    await tasksDb.createTask(task);
    const tasks = await tasksDb.getTasks();
    set({ tasks });
  },

  async editTask(task) {
    await tasksDb.updateTask(task);
    const [tasks, completedTasks] = await Promise.all([
      tasksDb.getTasks(),
      tasksDb.getCompletedTasks(),
    ]);
    set({ tasks, completedTasks });
  },

  async removeTask(id) {
    await tasksDb.deleteTask(id);
    const [tasks, completedTasks] = await Promise.all([
      tasksDb.getTasks(),
      tasksDb.getCompletedTasks(),
    ]);
    set({ tasks, completedTasks });
  },

  async markDone(id) {
    await tasksDb.markTaskDone(id);
    const [tasks, completedTasks] = await Promise.all([
      tasksDb.getTasks(),
      tasksDb.getCompletedTasks(),
    ]);
    set({ tasks, completedTasks });
  },

  async markTodo(id) {
    await tasksDb.markTaskTodo(id);
    const [tasks, completedTasks] = await Promise.all([
      tasksDb.getTasks(),
      tasksDb.getCompletedTasks(),
    ]);
    set({ tasks, completedTasks });
  },

  async refreshCompleted() {
    const completedTasks = await tasksDb.getCompletedTasks();
    set({ completedTasks });
  },

  openTaskForm: (task, defaultDate) =>
    set({
      taskForm: {
        open: true,
        item: task ?? ({
          id: "",
          title: "",
          description: null,
          project_id: null,
          category_id: null,
          due_date: defaultDate ?? null,
          priority: "medium",
          status: "todo",
          created_at: 0,
          completed_at: null,
        } as Task),
      },
    }),

  closeTaskForm: () => set({ taskForm: { open: false } }),

  openProjectForm: (project) => set({ projectForm: { open: true, item: project } }),
  closeProjectForm: () => set({ projectForm: { open: false } }),

  openCategoryForm: (category) => set({ categoryForm: { open: true, item: category } }),
  closeCategoryForm: () => set({ categoryForm: { open: false } }),
}));

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    useStore.getState().init();
  });
}
