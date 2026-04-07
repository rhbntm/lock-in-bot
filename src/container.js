import FocusRepository from "./repositories/focusRepository.js";
import FocusService from "./services/focusService.js";
import FocusStartCommand from "./commands/focusStart.js";

import UserRepository from "./repositories/userRepository.js";
import XPService from "./services/xpService.js";
import RankCommand from "./commands/rank.js";
import LeaderboardCommand from "./commands/leaderboard.js";
import LeaderboardDisplayService from "./services/leaderboardDisplayService.js";

import StreakRepository from "./repositories/streakRepository.js";
import StreakService from "./services/streakService.js";

export function createContainer(client) {
  const focusRepository = new FocusRepository();

  const focusService = new FocusService({
    focusRepository,
  });

  const userRepository = new UserRepository();

  const xpService = new XPService({
    userRepository,
  });

  const leaderboardDisplayService =
    new LeaderboardDisplayService({
      xpService,
    });

  const streakRepository = new StreakRepository();

  const streakService = new StreakService({
    streakRepository,
  });

  const focusStartCommand = new FocusStartCommand({
    focusService,
    xpService,
    leaderboardDisplayService,
    streakService,
    client,
  });

  const leaderboardCommand =
    new LeaderboardCommand({
      xpService,
    });

  const rankCommand = new RankCommand({
    xpService,
  });

  return {
    focusStartCommand,
    leaderboardCommand,
    rankCommand,
    leaderboardDisplayService,
  };
}