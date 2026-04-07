export default class XPService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async rewardFocus(userId, duration) {
    const xp = duration;
    return await this.userRepository.addXP(userId, xp);
  }

  async getRank(userId) {
    return await this.userRepository.getXP(userId);
  }

  async getLeaderboard(limit = 10) {
    return await this.userRepository.getLeaderboard(limit);
  }
}