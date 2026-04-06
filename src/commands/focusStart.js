export default class FocusStartCommand {
  constructor(focusService) {
    this.focusService = focusService;
  }

  async execute(interaction) {
    const duration = interaction.options.getInteger("duration");

    await this.focusService.start(interaction.user.id, duration);

    await interaction.reply(
      `🎯 Focus session started for ${duration} minutes!`
    );
  }
}