import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'sqlite.db');
const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    importance TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    pit_lane_races_left INTEGER DEFAULT 0
  );
`);

export default db;
