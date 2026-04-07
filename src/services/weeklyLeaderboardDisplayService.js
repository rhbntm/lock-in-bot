export default class WeeklyLeaderboardDisplayService {
  constructor({ weeklyXPService }) {
    this.weeklyXPService = weeklyXPService;
  }

  async update(channel) {
    const leaderboard = await this.weeklyXPService.getLeaderboard();

    const medals = ["🥇", "🥈", "🥉"];
    const lines = leaderboard.map(([userId, xp], i) => `${medals[i] || "#" + (i + 1)} <@${userId}> — ${xp} XP`);

    const content = `🏆 **Weekly Productivity Leaderboard**\n\n${lines.join("\n")}`;

    const messages = await channel.messages.fetch({ limit: 10 });
    const existing = messages.find(
      (msg) =>
        msg.author.id === channel.client.user.id &&
        msg.content.includes("Weekly Productivity Leaderboard")
    );

    if (existing) await existing.edit(content);
    else await channel.send(content);
  }
}