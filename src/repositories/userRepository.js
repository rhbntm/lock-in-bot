import db from "../database/db.js";

export default class UserRepository {
  // --- All-time XP ---
  async addXP(userId, amount) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO users (user_id, xp)
        VALUES (?, ?)
        ON CONFLICT(user_id)
        DO UPDATE SET xp = xp + ?
        `,
        [userId, amount, amount],
        function (err) {
          if (err) return reject(err);

          db.get(
            "SELECT xp FROM users WHERE user_id = ?",
            [userId],
            (err, row) => {
              if (err) return reject(err);
              resolve(row.xp);
            }
          );
        }
      );
    });
  }

  async getXP(userId) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT xp FROM users WHERE user_id = ?",
        [userId],
        (err, row) => {
          if (err) return reject(err);
          resolve(row?.xp || 0);
        }
      );
    });
  }

  async getLeaderboard(limit = 10) {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT user_id, xp
        FROM users
        ORDER BY xp DESC
        LIMIT ?
        `,
        [limit],
        (err, rows) => {
          if (err) return reject(err);

          resolve(rows.map((row) => [row.user_id, row.xp]));
        }
      );
    });
  }

  async getWeeklyXP(userId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT xp, weekStart FROM weekly_xp WHERE userId = ?`,
        [userId],
        (err, row) => {
          if (err) return reject(err);
          resolve(row || null);
        }
      );
    });
  }

  async setWeeklyXP(userId, { xp, weekStart }) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO weekly_xp (userId, xp, weekStart)
        VALUES (?, ?, ?)
        ON CONFLICT(userId)
        DO UPDATE SET xp = ?, weekStart = ?
        `,
        [userId, xp, weekStart, xp, weekStart],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }

  async getWeeklyLeaderboard(weekStart, limit = 10) {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT userId, xp
        FROM weekly_xp
        WHERE weekStart = ?
        ORDER BY xp DESC
        LIMIT ?
        `,
        [weekStart, limit],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows.map((row) => [row.userId, row.xp]));
        }
      );
    });
  }
}