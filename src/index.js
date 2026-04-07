import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import cron from "node-cron";
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
  weeklyLeaderboardDisplayService, // ← weekly leaderboard
} = createContainer(client);

client.once("clientReady", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // --- All-time leaderboard ---
  const leaderboardChannel = await client.channels.fetch(
    process.env.LEADERBOARD_CHANNEL_ID
  );
  await leaderboardDisplayService.update(leaderboardChannel);

  // --- Weekly leaderboard ---
  const weeklyChannel = await client.channels.fetch(
    process.env.WEEKLY_LEADERBOARD_CHANNEL_ID
  );
  await weeklyLeaderboardDisplayService.update(weeklyChannel);

  console.log("🏆 Leaderboards rendered on startup");

  // --- CRON JOB: Auto-update weekly leaderboard every Sunday midnight ---
  cron.schedule("0 0 * * 0", async () => {
    console.log("♻️ Updating weekly leaderboard...");
    await weeklyLeaderboardDisplayService.update(weeklyChannel);
  });
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