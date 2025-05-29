import { Money, ExpenseStatus } from "../../valueObjects";

export class Expense {
  constructor(
    private id: string,
    private amount: Money,
    private status: ExpenseStatus,
    private submitterId: string,
    private createdAt?: Date,
    private updatedAt?: Date,
  ) {}

  approve() {
    this.status = new ExpenseStatus("approved");
  }

  reject() {
    this.status = new ExpenseStatus("rejected");
  }

  getStatus() {
    return this.status;
  }
  getId() {
    return this.id;
  }

  isComplete() {
    return !this.status.isPending();
  }

  toJSON() {
    return {
      id: this.id,
      amount: this.amount.toValue(),
      status: this.status.toValue(),
      submitterId: this.submitterId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
