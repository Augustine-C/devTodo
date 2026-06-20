import { getDb } from "./index";
import type { Task } from "../types";

export async function getTasks(): Promise<Task[]> {
  const db = await getDb();
  return db.select<Task[]>(
    "SELECT * FROM tasks WHERE status != 'done' ORDER BY due_date ASC, created_at ASC"
  );
}

export async function getCompletedTasks(): Promise<Task[]> {
  const db = await getDb();
  return db.select<Task[]>(
    "SELECT * FROM tasks WHERE status = 'done' ORDER BY completed_at DESC"
  );
}

export async function createTask(t: Omit<Task, "created_at" | "completed_at">): Promise<void> {
  const db = await getDb();
  await db.execute(
    `INSERT INTO tasks (id, title, description, project_id, category_id, due_date, priority, status, created_at, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [t.id, t.title, t.description ?? null, t.project_id ?? null, t.category_id ?? null,
     t.due_date ?? null, t.priority, t.status, Date.now(), null]
  );
}

export async function updateTask(t: Task): Promise<void> {
  const db = await getDb();
  await db.execute(
    `UPDATE tasks SET title=?, description=?, project_id=?, category_id=?, due_date=?, priority=?, status=?, completed_at=? WHERE id=?`,
    [t.title, t.description ?? null, t.project_id ?? null, t.category_id ?? null,
     t.due_date ?? null, t.priority, t.status, t.completed_at ?? null, t.id]
  );
}

export async function markTaskDone(id: string): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE tasks SET status='done', completed_at=? WHERE id=?",
    [Date.now(), id]
  );
}

export async function markTaskTodo(id: string): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE tasks SET status='todo', completed_at=NULL WHERE id=?",
    [id]
  );
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM tasks WHERE id=?", [id]);
}
