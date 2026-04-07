import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { createContainer } from "./container.js";

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const {
  focusStartCommand,
  leaderboardCommand,
  rankCommand,
  leaderboardDisplayService,
} = createContainer(client);

client.once("clientReady", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch(
    process.env.LEADERBOARD_CHANNEL_ID
  );

  await leaderboardDisplayService.update(channel);

  console.log("🏆 Leaderboard rendered on startup");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "focus") {
    return await focusStartCommand.execute(interaction);
  }

  if (interaction.commandName === "rank") {
    return await rankCommand.execute(interaction);
  }

  if (interaction.commandName === "leaderboard") {
    return await leaderboardCommand.execute(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);