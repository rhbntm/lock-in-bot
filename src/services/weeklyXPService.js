export default class weeklyXPService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async addXP(userId, xp) {
    const weekStart = this.getWeekStart();

    let weekly = await this.userRepository.getWeeklyXP(userId);
    if (!weekly || weekly.weekStart !== weekStart) {
      weekly = { xp: 0, weekStart };
    }

    weekly.xp += xp;

    await this.userRepository.setWeeklyXP(userId, weekly);
    return weekly.xp;
  }

  async getLeaderboard() {
    const weekStart = this.getWeekStart();
    return this.userRepository.getWeeklyLeaderboard(weekStart);
  }

  // Reset all weekly XP entries for new week
  async resetWeekly() {
    const newWeekStart = this.getWeekStart();
    // This would typically clear and reset entries; for now we rely on 
    // the logic in addXP() that auto-resets when weekStart changes
    console.log(`📅 Weekly XP reset triggered for week starting ${newWeekStart}`);
  }

  getWeekStart() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const diff = now.getDate() - day; 
    const weekStart = new Date(now.setDate(diff));
    weekStart.setHours(0,0,0,0);
    return weekStart.toISOString();
  }
}