export default class FocusStartCommand {
  constructor(focusService, xpService) {
    this.focusService = focusService;
    this.xpService = xpService;
  }

  async execute(interaction) {
    await interaction.deferReply(); // acknowledge immediately

    const duration = interaction.options.getInteger("duration");

    const session = await this.focusService.start(
      interaction.user.id,
      duration
    );

    await interaction.editReply(
      `🎯 Locking in for ${duration} minute(s)!`
    );

    setTimeout(async () => {
      const totalXP = await this.xpService.rewardFocus(
        session.userId,
        duration
      );

      await interaction.followUp(
        `🎉 Focus complete for <@${session.userId}>!\n✨ +${duration} XP\n🏆 Total XP: ${totalXP}`
      );
    }, duration * 60 * 1000);
  }
}