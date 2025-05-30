import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserService } from "../User";
import { CreateUserCommand } from "../../commands/user";

const mockUserRepository = {
  createUser: vi.fn(),
  getUser: vi.fn(),
};

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    vi.clearAllMocks();
    userService = new UserService(mockUserRepository);
  });

  it("should create a user and return an id", async () => {
    const fakeUser = {
      getUserId: () => "user-123",
    };
    mockUserRepository.createUser.mockResolvedValue(fakeUser);

    const command: CreateUserCommand = {
      email: "test@test.com",
      managerId: "manager-1",
    };

    const result = await userService.create(command);

    expect(mockUserRepository.createUser).toHaveBeenCalledWith({
      email: "test@test.com",
      managerId: "manager-1",
    });

    expect(result).toEqual({ id: "user-123" });
  });

  it("should propagate errors from the repository", async () => {
    mockUserRepository.createUser.mockRejectedValue(new Error("DB Error"));

    const command: CreateUserCommand = {
      email: "fail@fail.com",
    };

    await expect(userService.create(command)).rejects.toThrow("DB Error");
  });
});
