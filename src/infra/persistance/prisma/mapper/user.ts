import { User as PrismaUser } from "@prisma/client";
import { nullableToUndefined } from "./utils";
import { User } from "../../../../domain/expenseManagement/entities/User";

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.id,
      prismaUser.email,
      nullableToUndefined(prismaUser.managerId),
    );
  }
}
