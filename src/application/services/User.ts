import { CreateUserCommand } from "../commands/user";
import { IUserRepository } from "../../domain/expenseManagement/repository";

export interface IUserService {
  create(command: CreateUserCommand): Promise<{ id: string }>;
}

export class ExpenseManagementService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async create(command: CreateUserCommand): Promise<{ id: string }> {
    const user = await this.userRepository.createUser({
      email: command.email,
      managerId: command.managerId,
    });
    return {
      id: user.getUserId(),
    };
  }
}
