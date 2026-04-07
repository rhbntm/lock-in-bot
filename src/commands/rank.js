export default class RankCommand {
  constructor({ xpService }) {
    this.xpService = xpService;
  }

  async execute(interaction) {
    const xp = await this.xpService.getRank(interaction.user.id);

    await interaction.reply(`🏆 You currently have ${xp} XP`);
  }
}