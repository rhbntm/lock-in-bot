import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./lockin.db");

db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS streaks (
    user_id TEXT PRIMARY KEY,
    streak_count INTEGER DEFAULT 1,
    last_completed_date TEXT
  )
`);
});

export default db;
