import { IsEmail, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO {
  @ApiProperty({
    example: "example@example.com",
    description: "email address",
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: "041d40e7-b398-4040-a9da-6c9cad0bda7a",
    description: "managerId of the user",
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly managerId?: string;
}

export class CreateUserResponseDTO {
  @ApiProperty({
    description: "userid",
    example: "52be2507-31b6-44c4-8b58-fa8932c27b53",
  })
  readonly id: string;
}
