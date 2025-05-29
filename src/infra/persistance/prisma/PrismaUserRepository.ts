import { PrismaClient } from "@prisma/client";
import {
  CreateUser,
  IUserRepository,
} from "../../../domain/expenseManagement/repository";
import { User } from "../../../domain/expenseManagement/entities/User";
import { ProblemDetails } from "../../../common/problemDetails";
import { UserMapper } from "./mapper/user";

export class PrismaUserRepository implements IUserRepository {
  constructor(private db: PrismaClient) {}

  async getUser(id: string): Promise<User> {
    const user = await this.db.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw ProblemDetails.notFoundError(`user (${id}) not found`);
    }
    return UserMapper.toDomain(user);
  }

  async createUser(params: CreateUser): Promise<User> {
    const user = await this.db.user.create({
      data: {
        email: params.email,
        managerId: params.managerId,
      },
    });

    return UserMapper.toDomain(user);
  }
}
