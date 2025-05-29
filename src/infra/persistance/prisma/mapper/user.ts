import { User as PrismaUser } from "@prisma/client";
import { nullableToUndefined } from "./utils";
import { User } from "../../../../domain/expenseManagement/entities/User";
import { Email } from "../../../../domain/valueObjects";

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.id,
      new Email(prismaUser.email),
      nullableToUndefined(prismaUser.managerId),
    );
  }
}
