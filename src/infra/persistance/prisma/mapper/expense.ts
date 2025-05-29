import { Expense as PrismaExpense } from "@prisma/client";
import { Expense } from "../../../../domain/expenseManagement/entities/Expense";
import { ExpenseStatus, Money } from "../../../../domain/valueObjects";

export class ExpenseMapper {
  static toDomain(expense: PrismaExpense): Expense {
    return new Expense(
      expense.id,
      new Money(expense.amount),
      new ExpenseStatus(expense.status),
      expense.submitterId,
    );
  }
}
