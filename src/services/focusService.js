export default class FocusService {
  constructor(focusRepository) {
    this.focusRepository = focusRepository;
  }

  async start(userId, duration) {
    await this.focusRepository.create(userId, duration);
  }
}