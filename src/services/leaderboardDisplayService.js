export default class LeaderboardDisplayService {
  constructor({ xpService }) {
    this.xpService = xpService;
  }

  async update(channel) {
    const leaderboard = await this.xpService.getLeaderboard();

    const medals = ["🥇", "🥈", "🥉"];

    const lines = leaderboard.map(([userId, xp], index) => {
      const icon = medals[index] || `#${index + 1}`;
      return `${icon} <@${userId}> — ${xp} XP`;
    });

    const content =
      `🏆 **Live Productivity Leaderboard**\n\n${lines.join("\n")}`;

    const messages = await channel.messages.fetch({ limit: 10 });

    const existingMessage = messages.find(
      (msg) =>
        msg.author.id === channel.client.user.id &&
        msg.content.includes("Live Productivity Leaderboard")
    );

    if (existingMessage) {
      await existingMessage.edit(content);
    } else {
      await channel.send(content);
    }
  }
}

