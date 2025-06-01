import { Module } from "@nestjs/common";
import { TOKENS } from "../../tokens";
import { ExpenseManagementService } from "../../../../application/services/ExpenseManagement";
import { ExpenseManagementUsecase } from "../../../../domain/expenseManagement/usecase";
import {
  PrismaUserRepository,
  PrismaExpenseRepository,
  PrismaApprovalAssignmentRepository,
} from "../../../../infra/persistance/prisma";
import { EmailNotification } from "../../../../infra/notify/Email";
import { ExpenseContoller } from "./expense.contoller";
import { createPrismaClient } from "../../../../infra/persistance/prisma/client";

@Module({
  providers: [
    {
      provide: TOKENS.ExpenseService,
      useFactory: (usecase, notService, userRep, assignmentRep, expenseRep) =>
        new ExpenseManagementService(
          usecase,
          notService,
          userRep,
          expenseRep,
          assignmentRep,
        ),
      inject: [
        TOKENS.ExpenseUsecase,
        TOKENS.NotificationService,
        TOKENS.UserRepository,
        TOKENS.ApprovalAssignmentRepository,
        TOKENS.ExpenseRepository,
      ],
    },
    {
      provide: TOKENS.ExpenseUsecase,
      useClass: ExpenseManagementUsecase,
    },
    {
      provide: TOKENS.NotificationService,
      useClass: EmailNotification,
    },
    {
      provide: TOKENS.UserRepository,
      useFactory: (db) => new PrismaUserRepository(db),
      inject: [TOKENS.Db],
    },
    {
      provide: TOKENS.ApprovalAssignmentRepository,
      useFactory: (db) => new PrismaApprovalAssignmentRepository(db),
      inject: [TOKENS.Db],
    },
    {
      provide: TOKENS.ExpenseRepository,
      useFactory: (db) => new PrismaExpenseRepository(db),
      inject: [TOKENS.Db],
    },
    {
      provide: TOKENS.Db,
      useFactory: () => createPrismaClient(),
    },
  ],
  controllers: [ExpenseContoller],
})
export class ExpenseModule {}
