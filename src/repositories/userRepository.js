import db from "../database/db.js";

export default class UserRepository {
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
}