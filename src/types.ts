export interface Project {
  id: string;
  name: string;
  color: string;
  description: string | null;
  created_at: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  project_id: string | null;
  created_at: number;
}

export type Priority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done";
export type View = "daily" | "weekly" | "monthly" | "done";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  project_id: string | null;
  category_id: string | null;
  due_date: number | null;
  priority: Priority;
  status: TaskStatus;
  created_at: number;
  completed_at: number | null;
}
