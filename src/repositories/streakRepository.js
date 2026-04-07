import db from "../database/db.js";

export default class StreakRepository {
  async get(userId) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM streaks WHERE user_id = ?",
        [userId],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }

  async save(userId, streakCount, date) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO streaks (user_id, streak_count, last_completed_date)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id)
        DO UPDATE SET
          streak_count = excluded.streak_count,
          last_completed_date = excluded.last_completed_date
        `,
        [userId, streakCount, date],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }
}