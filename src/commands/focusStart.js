export default class FocusStartCommand {
  constructor({
    focusService,
    xpService,
    weeklyXPService,
    leaderboardDisplayService,
    streakService,
    focusRepository,
    client,
  }) {
    this.focusService = focusService;
    this.xpService = xpService;
    this.weeklyXPService = weeklyXPService;
    this.leaderboardDisplayService = leaderboardDisplayService;
    this.streakService = streakService;
    this.focusRepository = focusRepository;
    this.client = client;
  }

  async execute(interaction) {
    await interaction.deferReply();

    const duration = interaction.options.getInteger("duration");

    // Check for active session (overlap prevention)
    const existingSession = await this.focusRepository.getActiveSessionByUser(
      interaction.user.id
    );
    if (existingSession) {
      await interaction.editReply(
        `❌ You already have an active focus session! Complete it or wait for it to expire.`
      );
      return;
    }

    try {
      const session = await this.focusService.start(
        interaction.user.id,
        duration
      );

      // Persist session to database
      await this.focusRepository.createPersistent(
        interaction.user.id,
        duration
      );

      await interaction.editReply(
        `🎯 Locking in for ${duration} minute(s)!`
      );

      setTimeout(async () => {
        try {
          const totalXP = await this.xpService.rewardFocus(
            session.userId,
            duration
          );

          await this.weeklyXPService.addXP(session.userId, duration);

          const streak = await this.streakService.update(
            session.userId
          );

          await interaction.followUp(
            `🎉 Lock in complete for <@${session.userId}>!\n` +
            `✨ +${duration} XP\n` +
            `🏆 Total XP: ${totalXP}\n` +
            `🔥 Streak: ${streak} day(s)`
          );

          const channel = await this.client.channels.fetch(
            process.env.LEADERBOARD_CHANNEL_ID
          );

          await this.leaderboardDisplayService.update(channel);
        } catch (timeoutError) {
          console.error("Error in focus completion timeout:", timeoutError);
        }
      }, duration * 60 * 1000);
    } catch (error) {
      await interaction.editReply(`❌ Error: ${error.message}`);
    }
  }
}