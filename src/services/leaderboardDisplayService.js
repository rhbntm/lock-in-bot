export default class LeaderboardDisplayService {
  constructor(xpService) {
    this.xpService = xpService;
    this.message = null; // temporary in-memory
  }

  async update(channel) {
    const leaderboard = await this.xpService.getLeaderboard();

    if (leaderboard.length === 0) return;

    const medals = ["🥇", "🥈", "🥉"];

    const lines = leaderboard.map(([userId, xp], index) => {
      const icon = medals[index] || `#${index + 1}`;
      return `${icon} <@${userId}> — ${xp} XP`;
    });

    const content =
      `🏆 **Live Productivity Leaderboard**\n\n${lines.join("\n")}`;

    if (!this.message) {
      this.message = await channel.send(content);
    } else {
      await this.message.edit(content);
    }
  }
}