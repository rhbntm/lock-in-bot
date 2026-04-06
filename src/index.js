import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import FocusRepository from "./repositories/focusRepository.js";
import FocusService from "./services/focusService.js";
import FocusStartCommand from "./commands/focusStart.js";

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const focusRepository = new FocusRepository();
const focusService = new FocusService(focusRepository);
const focusStartCommand = new FocusStartCommand(focusService);

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "focus") {
    await focusStartCommand.execute(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);