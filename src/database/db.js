import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./lockin.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      xp INTEGER DEFAULT 0
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS streaks (
      user_id TEXT PRIMARY KEY,
      streak_count INTEGER DEFAULT 1,
      last_completed_date TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS weekly_xp (
      userId TEXT PRIMARY KEY,
      xp INTEGER DEFAULT 0,
      weekStart TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS focus_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      duration INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      status TEXT DEFAULT 'active'
    )
  `);
});

export default db;