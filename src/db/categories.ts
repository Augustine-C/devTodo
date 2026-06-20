import { getDb } from "./index";
import type { Category } from "../types";

export async function getCategories(): Promise<Category[]> {
  const db = await getDb();
  return db.select<Category[]>("SELECT * FROM categories ORDER BY created_at ASC");
}

export async function createCategory(c: Omit<Category, "created_at">): Promise<void> {
  const db = await getDb();
  await db.execute(
    "INSERT INTO categories (id, name, color, project_id, created_at) VALUES (?, ?, ?, ?, ?)",
    [c.id, c.name, c.color, c.project_id ?? null, Date.now()]
  );
}

export async function updateCategory(c: Category): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE categories SET name=?, color=?, project_id=? WHERE id=?",
    [c.name, c.color, c.project_id ?? null, c.id]
  );
}

export async function deleteCategory(id: string): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM categories WHERE id=?", [id]);
}
