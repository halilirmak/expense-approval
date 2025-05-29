export class User {
  constructor(
    private id: string,
    private email: string,
    private managerId?: string,
  ) {}

  isManaged() {
    return !!this.managerId;
  }

  getManagerId() {
    return this.managerId;
  }

  getUserId() {
    return this.id;
  }

  getEmail() {
    return this.email;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      managerId: this.managerId,
    };
  }
}
