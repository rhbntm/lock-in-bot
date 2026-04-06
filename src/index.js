import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import FocusRepository from "./repositories/focusRepository.js";
import FocusService from "./services/focusService.js";
import FocusStartCommand from "./commands/focusStart.js";

import UserRepository from "./repositories/userRepository.js";
import XPService from "./services/xpService.js";
import RankCommand from "./commands/rank.js";
import LeaderboardCommand from "./commands/leaderboard.js";
import LeaderboardDisplayService from "./services/leaderboardDisplayService.js";

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const focusRepository = new FocusRepository();
const focusService = new FocusService(focusRepository);

const userRepository = new UserRepository();
const xpService = new XPService(userRepository);

const leaderboardDisplayService = new LeaderboardDisplayService(xpService);
const focusStartCommand = new FocusStartCommand(
  focusService,
  xpService,
  leaderboardDisplayService,
  client
);

const leaderboardCommand = new LeaderboardCommand(xpService);
const rankCommand = new RankCommand(xpService);

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "focus") {
    await focusStartCommand.execute(interaction);
  }

  if (interaction.commandName === "rank") {
    await rankCommand.execute(interaction);
  }
  
  if (interaction.commandName === "leaderboard") {
  await leaderboardCommand.execute(interaction);
  }

});

client.login(process.env.DISCORD_TOKEN);
