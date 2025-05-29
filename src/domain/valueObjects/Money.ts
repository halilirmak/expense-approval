import { ProblemDetails } from "../../common/problemDetails";

export class Money {
  constructor(private amount: string) {
    const moneyRegex = /^\d+(\.\d{2})?$/;
    if (!moneyRegex.test(this.amount)) {
      throw ProblemDetails.invalidInputError(
        `money is not correct format ${this.amount}`,
      );
    }
  }

  toCent() {
    const [whole, fraction = "00"] = this.amount.split(".");
    return parseInt(whole) * 100 + parseInt(fraction);
  }

  toValue() {
    return this.amount;
  }

  static from(amount: number) {
    return (amount / 100).toFixed(2).toString();
  }
}
