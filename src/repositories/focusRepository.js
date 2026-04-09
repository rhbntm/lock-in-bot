import db from "../database/db.js";

export default class FocusRepository {
  constructor() {
    this.sessions = [];
  }

  async create(session) {
    this.sessions.push(session);
    console.log(this.sessions);
  }

  // Check if user has an active session
  async getActiveSessionByUser(userId) {
    return this.sessions.find((s) => s.userId === userId);
  }

  // Create a session and persist to database
  async createPersistent(userId, duration) {
    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + duration * 60 * 1000).toISOString();

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO focus_sessions (user_id, duration, start_time, end_time, status)
         VALUES (?, ?, ?, ?, 'active')`,
        [userId, duration, startTime, endTime],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, userId, duration, startTime, endTime, status: 'active' });
        }
      );
    });
  }

  // Get all active sessions that have expired
  async getActiveSessions() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM focus_sessions WHERE status = 'active' AND end_time <= datetime('now')`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  // Mark session as completed
  async markComplete(sessionId) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE focus_sessions SET status = 'completed' WHERE id = ?`,
        [sessionId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
}