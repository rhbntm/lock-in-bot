export default class FocusService {
  constructor(focusRepository) {
    this.focusRepository = focusRepository;
  }

  async start(userId, duration) {
    const session = {
      userId,
      duration,
      startedAt: new Date(),
    };

    await this.focusRepository.create(session);

    return session;
  }
}