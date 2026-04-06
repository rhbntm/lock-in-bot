import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./lockin.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      xp INTEGER DEFAULT 0
    )
  `);
});

export default db;