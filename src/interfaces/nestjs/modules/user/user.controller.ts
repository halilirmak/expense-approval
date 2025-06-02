import { Body, Controller, Post, Inject } from "@nestjs/common";

import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IUserService } from "../../../../application/services/User";
import { TOKENS } from "../../tokens";
import { CreateUserDTO, CreateUserResponseDTO } from "./dto";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(
    @Inject(TOKENS.UserService)
    private userService: IUserService,
  ) {}

  @Post()
  @ApiOperation({ summary: "create an user" })
  @ApiResponse({
    status: 201,
    description: "returns user id",
    type: CreateUserResponseDTO,
  })
  @Post()
  async createExpense(
    @Body()
    body: CreateUserDTO,
  ): Promise<CreateUserResponseDTO> {
    return this.userService.create(body);
  }
}
