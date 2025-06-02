import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "../src/interfaces/nestjs/app.module";
import { GlobalExceptionFilter } from "../src/interfaces/nestjs/filter/GlobalExceptionFilter";
import { Logger } from "../src/infra/logger/";
import { config } from "../src/config";
import { ValidationPipe } from "@nestjs/common";
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const logger = new Logger(config);

  app.useGlobalFilters(new GlobalExceptionFilter(logger));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const options = new DocumentBuilder()
    .setTitle("Expense Approval")
    .setDescription("Service to approve expenses")
    .setVersion("1.0")
    .addTag("expense")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);

  await app.listen(config.PORT);

  logger.info(
    ` Application ${config.APP_NAME} running on ${await app.getUrl()}`,
  );
}
bootstrap();
