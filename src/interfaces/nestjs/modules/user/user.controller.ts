import { Body, Controller, Post, Inject } from "@nestjs/common";

import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IUserService } from "../../../../application/services/User";
import { TOKENS } from "../../tokens";
import { CreateUserDTO } from "./dto";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(
    @Inject(TOKENS.UserService)
    private userService: IUserService,
  ) {}

  @Post()
  @ApiOperation({ summary: "create an user" })
  @ApiResponse({ status: 201, description: "returns user id" })
  @Post()
  async createExpense(
    @Body()
    body: CreateUserDTO,
  ) {
    return this.userService.create(body);
  }
}
