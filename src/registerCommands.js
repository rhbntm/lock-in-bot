import { REST, Routes, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName("focus")
    .setDescription("Start a focus session")
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("Focus duration in minutes")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("rank")
    .setDescription("See your total XP"),

    new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("View top XP rankings"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

await rest.put(
  Routes.applicationGuildCommands(
    process.env.CLIENT_ID,
    process.env.GUILD_ID
  ),
  { body: commands }
);

console.log("✅ Commands registered");