import Database from "@tauri-apps/plugin-sql";
import { migrations } from "./migrations";

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!db) {
    db = await Database.load("sqlite:devtodo.db");
    for (const stmt of migrations) {
      await db.execute(stmt);
    }
    await db.execute("PRAGMA foreign_keys = ON");
  }
  return db;
}
