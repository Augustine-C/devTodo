import { getDb } from "./index";
import type { Project } from "../types";

export async function getProjects(): Promise<Project[]> {
  const db = await getDb();
  return db.select<Project[]>("SELECT * FROM projects ORDER BY created_at ASC");
}

export async function createProject(p: Omit<Project, "created_at">): Promise<void> {
  const db = await getDb();
  await db.execute(
    "INSERT INTO projects (id, name, color, description, created_at) VALUES (?, ?, ?, ?, ?)",
    [p.id, p.name, p.color, p.description ?? null, Date.now()]
  );
}

export async function updateProject(p: Project): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE projects SET name=?, color=?, description=? WHERE id=?",
    [p.name, p.color, p.description ?? null, p.id]
  );
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM projects WHERE id=?", [id]);
}
