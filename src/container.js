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
import WeeklyXPService from "./services/weeklyXPService.js";
import WeeklyLeaderboardDisplayService from "./services/weeklyLeaderboardDisplayService.js";

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

  const weeklyXPService = new WeeklyXPService({ userRepository });

  const focusStartCommand = new FocusStartCommand({
    focusService,
    xpService,
    weeklyXPService,
    leaderboardDisplayService,
    streakService,
    focusRepository,
    client,
  });

  const leaderboardCommand =
    new LeaderboardCommand({
      xpService,
    });

  const rankCommand = new RankCommand({
    xpService,
  });

  const weeklyLeaderboardDisplayService = new WeeklyLeaderboardDisplayService({ weeklyXPService });


  return {
    focusStartCommand,
    leaderboardCommand,
    rankCommand,
    leaderboardDisplayService,
    weeklyXPService,
    weeklyLeaderboardDisplayService,
  };
}