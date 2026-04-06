export default class FocusStartCommand {
  constructor(focusService, xpService, leaderboardDisplayService, client) {
    this.focusService = focusService;
    this.xpService = xpService;
    this.leaderboardDisplayService = leaderboardDisplayService;
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

    await interaction.followUp(
      `🎉 Focus complete for <@${session.userId}>!\n✨ +${duration} XP\n🏆 Total XP: ${totalXP}`,
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