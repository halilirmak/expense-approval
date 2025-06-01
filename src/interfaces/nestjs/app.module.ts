import { Module } from "@nestjs/common";

import { ExpenseModule } from "./modules/expense/expense.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [ExpenseModule, UserModule],
})
export class AppModule {}
