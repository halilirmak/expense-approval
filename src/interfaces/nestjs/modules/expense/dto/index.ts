import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum Approval {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export class ApproveAssignmentDTO {
  @ApiProperty({
    example: "APPROVED",
    description: "Desicion regarding to expense",
  })
  @IsEnum(Approval)
  readonly approval: Approval;

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
