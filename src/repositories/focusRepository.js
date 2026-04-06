export default class FocusRepository {
  constructor() {
    this.sessions = [];
  }

  async create(userId, duration) {
    this.sessions.push({
      userId,
      duration,
      startedAt: new Date(),
    });

    console.log(this.sessions);
  }
}