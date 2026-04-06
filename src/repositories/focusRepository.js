export default class FocusRepository {
  constructor() {
    this.sessions = [];
  }

  async create(session) {
    this.sessions.push(session);
    console.log(this.sessions);
  }
}