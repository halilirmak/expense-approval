import { Router } from "express";
import { ExpenseManagementController } from "../controllers/ExpenseManagementControllers";
import { requestValidator } from "../middleware/RequestValidationMiddleware";

export const ApiRouter = (controller: ExpenseManagementController) => {
  const router = Router();
  router.post(
    "/expense/:id",
    requestValidator(controller.approveAssigmentSchema),
    controller.approveExpense.bind(controller),
  );

  return router;
};
