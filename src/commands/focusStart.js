export default class FocusStartCommand {
  constructor(focusService, xpService, leaderboardDisplayService, streakService, client) {
    this.focusService = focusService;
    this.xpService = xpService;
    this.leaderboardDisplayService = leaderboardDisplayService;
    this.streakService = streakService;
    this.client = client;
  }

  async execute(interaction) {
    await interaction.deferReply(); // acknowledge immediately

    const duration = interaction.options.getInteger("duration");

    const session = await this.focusService.start(
      interaction.user.id,
      duration,
    );

    await interaction.editReply(`🎯 Locking in for ${duration} minute(s)!`);

setTimeout(
  async () => {
    const totalXP = await this.xpService.rewardFocus(session.userId, duration);
    const streak = await this.streakService.update(session.userId);

    await interaction.followUp(
      `🎉 Lock in complete for <@${session.userId}>!
    ✨ +${duration} XP
    🏆 Total XP: ${totalXP}
    🔥 Streak: ${streak} day(s)`,
    );

    const channel = await this.client.channels.fetch(
      process.env.LEADERBOARD_CHANNEL_ID,
    );

    await this.leaderboardDisplayService.update(channel);
  },
  duration * 60 * 1000,
);
  }
}