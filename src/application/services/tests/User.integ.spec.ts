import { beforeAll, describe, it, expect } from "vitest";
import { prismaClient } from "../../../../test/setupIntegration";

import { UserService } from "../User";
import { IUserRepository } from "../../../domain/expenseManagement/repository";
import { CreateUserCommand } from "../../commands/user";
import { PrismaUserRepository } from "../../../infra/persistance/prisma";

let userRepository: IUserRepository;
let userService: UserService;

beforeAll(async () => {
  userRepository = new PrismaUserRepository(prismaClient);
  userService = new UserService(userRepository);
});

describe("UserService Integration Tests", () => {
  it("creates a user and returns the id", async () => {
    const command: CreateUserCommand = { email: "test@example.com" };

    const result = await userService.create(command);

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("string");

    const user = await prismaClient.user.findUnique({
      where: { id: result.id },
    });
    expect(user).not.toBeNull();
    expect(user?.email).toBe("test@example.com");
  });
});
