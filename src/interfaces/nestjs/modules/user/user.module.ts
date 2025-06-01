import { Module } from "@nestjs/common";
import { TOKENS } from "../../tokens";
import { UserService } from "../../../../application/services/User";
import { PrismaUserRepository } from "../../../../infra/persistance/prisma";
import { UserController } from "./user.controller";
import { createPrismaClient } from "../../../../infra/persistance/prisma/client";

@Module({
  providers: [
    {
      provide: TOKENS.UserService,
      useFactory: (userRepository) => new UserService(userRepository),
      inject: [TOKENS.UserRepository],
    },
    {
      provide: TOKENS.UserRepository,
      useFactory: (db) => new PrismaUserRepository(db),
      inject: [TOKENS.Db],
    },
    {
      provide: TOKENS.Db,
      useFactory: () => createPrismaClient(),
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
