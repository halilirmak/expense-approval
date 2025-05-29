import { Router } from "express";
import { ExpenseManagementController } from "../controllers/ExpenseManagementControllers";
import { UserController } from "../controllers/UserController";
import { requestValidator } from "../middleware/RequestValidationMiddleware";

export const ApiRouter = (
  expenseController: ExpenseManagementController,
  userController: UserController,
) => {
  const router = Router();
  router.post(
    "/expense/:id",
    requestValidator(expenseController.approveAssigmentSchema),
    expenseController.approveExpense.bind(expenseController),
  );

  router.post(
    "/expense",
    requestValidator(expenseController.createExpenseSchema),
    expenseController.createExpense.bind(expenseController),
  );

  router.post(
    "/user",
    requestValidator(userController.createUserSchema),
    userController.createUser.bind(userController),
  );

  return router;
};
