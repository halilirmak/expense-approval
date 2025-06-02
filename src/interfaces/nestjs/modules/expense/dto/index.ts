import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum ApprovalStatus {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export class ApproveAssignmentDTO {
  @ApiProperty({
    example: "APPROVED",
    description: "Desicion regarding to expense",
  })
  @IsEnum(ApprovalStatus)
  readonly approval: ApprovalStatus;

  @ApiProperty({
    example: "can not approve for some reason",
    description: "reason when rejected, required when approval is REJECTED",
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly reason?: string;

  @ApiProperty({
    example: "8e4ccc46-812b-4d27-8ae9-64fde8d507d2",
    description: "user id of approver",
  })
  @IsUUID()
  readonly userId: string;
}

export class CreateExpenseDTO {
  @ApiProperty({ example: "500.00", description: "expense amount" })
  @IsString()
  readonly amount: string;

  @ApiProperty({
    example: "bd1e9a93-976b-4a25-999c-3921c3a04fe3",
    description: "user id of expense creator",
  })
  @IsUUID()
  readonly submitterId: string;
}

export class ExpenseDTO {
  @ApiProperty({
    example: "1d852e79-b6ca-4df1-9458-38b82aabe37c",
    description: "expense id",
  })
  readonly id: string;

  @ApiProperty({ example: "500.00", description: "expense amount" })
  readonly amount: string;

  @ApiProperty({ example: "APPROVED", description: "status of the expense" })
  readonly status: string;

  @ApiProperty({
    example: "c562aac5-24c7-4a53-8135-f290857b2f94",
    description: "owner of the expense",
  })
  readonly submitterId: string;

  readonly createdAt?: Date;

  readonly updatedAt?: Date;
}

export class AssignmentDTO {
  @ApiProperty({
    example: "1d852e79-b6ca-4df1-9458-38b82aabe37c",
    description: "assignment id",
  })
  readonly id: string;

  @ApiProperty({
    example: "05c7bed6-20fb-4b5c-972a-7add28000ac0",
    description: "expense id",
  })
  readonly expenseId: string;

  @ApiProperty({
    example: "too expensive",
    description: "reason of REJECTED, required on reject",
    required: false,
  })
  readonly reason?: string;

  @ApiProperty({
    example: "d0881bb2-6603-4029-b3cb-7091fcdc14a5",
    description: "id of the user who approved it",
  })
  readonly approverId: string;

  @ApiProperty({
    example: "APPROVED",
    description: "status of assignment",
  })
  readonly status: string;

  readonly createdAt?: Date;
}
export class ApproveAssignmentResponseDTO {
  @ApiProperty({ description: "expense details" })
  readonly expense: ExpenseDTO;
  @ApiProperty({ description: "assignment details" })
  readonly assignment: AssignmentDTO;
  @ApiProperty({
    example: "27d6e953-d42c-430e-b70d-1b3965c43633",
    description: "next approver id",
    required: false,
  })
  readonly nextApprover?: string;
}

export class CreateExpenseResponseDTO {
  @ApiProperty({
    description: "expense id",
    example: "52be2507-31b6-44c4-8b58-fa8932c27b53",
  })
  readonly id: string;
}
