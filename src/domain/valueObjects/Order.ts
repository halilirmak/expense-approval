import { ProblemDetails } from "../../common/problemDetails";

export class Order {
  constructor(private order: number) {
    if (order < 0) {
      throw ProblemDetails.invalidInputError(
        `order can not less than 0, value: (${order})`,
      );
    }
  }

  toValue() {
    return this.order;
  }

  next() {
    return this.order + 1;
  }
}
