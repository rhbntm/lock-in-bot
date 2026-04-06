export default class UserRepository {
  constructor() {
    this.users = new Map();
  }

  async addXP(userId, amount) {
    const currentXP = this.users.get(userId) || 0;
    const newXP = currentXP + amount;

    this.users.set(userId, newXP);

    return newXP;
  }

  async getXP(userId) {
    return this.users.get(userId) || 0;
  }

  async getLeaderboard(limit = 10) {
    return [...this.users.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }
}