import {
  Body,
  Controller,
  Post,
  Param,
  ParseUUIDPipe,
  Inject,
} from "@nestjs/common";

import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IExpenseManagementService } from "../../../../application/services/ExpenseManagement";
import { TOKENS } from "../../tokens";
import {
  CreateExpenseDTO,
  ApproveAssignmentDTO,
  ApproveAssignmentResponseDTO,
  CreateExpenseResponseDTO,
} from "./dto";

@ApiTags("expense")
@Controller("expense")
export class ExpenseContoller {
  constructor(
    @Inject(TOKENS.ExpenseService)
    private expenseService: IExpenseManagementService,
  ) {}

  @Post()
  @ApiOperation({ summary: "create an expense" })
  @ApiResponse({
    status: 201,
    description: "returns expense id",
    type: CreateExpenseResponseDTO,
  })
  @Post()
  async createExpense(
    @Body()
    body: CreateExpenseDTO,
  ): Promise<CreateExpenseResponseDTO> {
    console.log(body);
    return this.expenseService.createExpense(body);
  }

  @Post(":id")
  @ApiOperation({ summary: "approve expense" })
  @ApiResponse({
    status: 200,
    description: "approves expense",
    type: ApproveAssignmentResponseDTO,
  })
  @Post()
  async approveExpense(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body()
    body: ApproveAssignmentDTO,
  ): Promise<ApproveAssignmentResponseDTO> {
    return this.expenseService.approve({
      expenseId: id,
      ...body,
    });
  }
}
