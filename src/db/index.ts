import Database from "@tauri-apps/plugin-sql";
import { migrations } from "./migrations";

// 缓存“进行中的 Promise”，而非已解析实例：
// 避免首次并发调用 getDb() 时重复建连 / 重复跑迁移（ISSUE-001）。
let dbPromise: Promise<Database> | null = null;

async function openAndMigrate(): Promise<Database> {
  const db = await Database.load("sqlite:devtodo.db");

  // 读取当前 schema 版本（PRAGMA 返回单行）。
  const rows = await db.select<{ user_version: number }[]>("PRAGMA user_version");
  const current = rows[0]?.user_version ?? 0;

  // 逐版本补跑未应用的迁移，成功后回写版本号。
  // 注意：user_version 不支持占位符绑定，此处 v + 1 为受控整数。
  for (let v = current; v < migrations.length; v++) {
    for (const stmt of migrations[v]) {
      await db.execute(stmt);
    }
    await db.execute(`PRAGMA user_version = ${v + 1}`);
  }

  await db.execute("PRAGMA foreign_keys = ON");
  return db;
}

export function getDb(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = openAndMigrate().catch((err) => {
      dbPromise = null; // 失败后允许重试
      throw err;
    });
  }
  return dbPromise;
}
