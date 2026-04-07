export default class StreakService {
  constructor(streakRepository) {
    this.streakRepository = streakRepository;
  }

  async update(userId) {
    const today = new Date().toISOString().split("T")[0];

    const streak = await this.streakRepository.get(userId);

    if (!streak) {
      await this.streakRepository.save(userId, 1, today);
      return 1;
    }

    const lastDate = new Date(streak.last_completed_date);
    const currentDate = new Date(today);

    const diffDays = Math.floor(
      (currentDate - lastDate) / (1000 * 60 * 60 * 24)
    );

    let newCount = streak.streak_count;

    if (diffDays === 1) {
      newCount += 1;
    } else if (diffDays > 1) {
      newCount = 1;
    }

    await this.streakRepository.save(userId, newCount, today);

    return newCount;
  }
}