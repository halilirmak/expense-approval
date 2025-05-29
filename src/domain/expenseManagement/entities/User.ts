import { Email } from "../../../domain/valueObjects";

export class User {
  constructor(
    private id: string,
    private email: Email,
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
    return this.email.toValue();
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email.toValue(),
      managerId: this.managerId,
    };
  }
}
