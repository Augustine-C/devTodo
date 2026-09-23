// 有序迁移：外层下标 = 版本序号（从 0 起），每项可含多条语句。
// 规则：只允许“追加”新版本，禁止修改 / 删除已发布的迁移
//（否则已升级的库不会重跑，导致 schema 漂移）。
export const migrations: string[][] = [
  // v1 — 初始建表
  [
    `CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#6366f1',
      description TEXT,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#8b5cf6',
      project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
      category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
      due_date INTEGER,
      priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
      status TEXT CHECK(status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo',
      created_at INTEGER NOT NULL,
      completed_at INTEGER
    )`,
  ],
  // v2 — 任务新增“开始日期”，供周视图跨天色块使用（FEAT-001）
  [`ALTER TABLE tasks ADD COLUMN start_date INTEGER`],
];
