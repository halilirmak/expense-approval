import { ProblemDetails } from "../../common/problemDetails";

export class Email {
  constructor(private readonly email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.email)) {
      throw ProblemDetails.invalidInputError(
        `Email is not in correct format: ${this.email}`,
      );
    }
  }

  toValue(): string {
    return this.email;
  }

  static from(value: string): Email {
    return new Email(value);
  }
}
