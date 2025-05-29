import {
  asClass,
  createContainer,
  asFunction,
  InjectionMode,
  AwilixContainer,
  asValue,
} from "awilix";
import { Server } from "./Server";
import { Router } from "./router";
import { ApiRouter } from "./router/api";
import { ExpenseManagementController } from "./controllers/ExpenseManagementControllers";
import { UserController } from "./controllers/UserController";
import { ExpenseManagementService } from "../../application/services/ExpenseManagement";
import { ExpenseManagementUsecase } from "../../domain/expenseManagement/usecase";
import { EmailNotification } from "../../infra/notify/Email";
import { Logger } from "../../infra/logger/";
import { ErrorMiddleware } from "./middleware/ErrorMiddleware";
import { createPrismaClient } from "../../infra/persistance/prisma/client";
import {
  PrismaUserRepository,
  PrismaExpenseRepository,
  PrismaApprovalAssignmentRepository,
} from "../../infra/persistance/prisma";
import { config } from "../../config";

export class Container {
  private readonly container: AwilixContainer;

  constructor() {
    this.container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    });

    this.register();
  }

  public register(): void {
    this.container
      .register({
        //core components
        config: asValue(config),
        logger: asClass(Logger).singleton(),
        server: asClass(Server).singleton(),
        router: asFunction(Router).singleton(),
        db: asFunction(createPrismaClient).singleton(),
      })
      .register({
        errorMiddleware: asClass(ErrorMiddleware).singleton(),
        apiRouter: asFunction(ApiRouter).singleton(),
      })
      .register({
        usecase: asClass(ExpenseManagementUsecase).singleton(),
        expenseController: asClass(ExpenseManagementController).singleton(),
        userController: asClass(UserController).singleton(),
        notificationService: asClass(EmailNotification).singleton(),
        service: asClass(ExpenseManagementService).singleton(),
        userRepository: asClass(PrismaUserRepository).singleton(),
        expenseRepository: asClass(PrismaExpenseRepository).singleton(),
        approvalAssignmentRepository: asClass(
          PrismaApprovalAssignmentRepository,
        ).singleton(),
      });
  }

  public invoke(): AwilixContainer {
    return this.container;
  }
}
