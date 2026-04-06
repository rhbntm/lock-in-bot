export default class LeaderboardCommand {
  constructor(xpService) {
    this.xpService = xpService;
  }

  async execute(interaction) {
    const leaderboard = await this.xpService.getLeaderboard();

    if (leaderboard.length === 0) {
      return interaction.reply("🏆 No XP data yet. Start focusing first!");
    }

    const medals = ["🥇", "🥈", "🥉"];

    const lines = leaderboard.map(([userId, xp], index) => {
      const icon = medals[index] || `#${index + 1}`;
      return `${icon} <@${userId}> — ${xp} XP`;
    });

    await interaction.reply(
      `🏆 **Productivity Leaderboard**\n\n${lines.join("\n")}`
    );
  }
}