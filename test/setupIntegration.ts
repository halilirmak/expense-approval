import { beforeAll, afterAll } from "vitest";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";

let postgresContainer: StartedPostgreSqlContainer;
let prismaClient: PrismaClient;

beforeAll(async () => {
  postgresContainer = await new PostgreSqlContainer("postgres:latest").start();

  const host = postgresContainer.getHost();
  const port = postgresContainer.getPort();
  const user = postgresContainer.getUsername();
  const password = postgresContainer.getPassword();
  const database = postgresContainer.getDatabase();

  const databaseUrl = `postgresql://${user}:${password}@${host}:${port}/${database}`;

  try {
    execSync("npx prisma migrate deploy", {
      env: { ...process.env, APP_DATABASE_URL: databaseUrl },
      stdio: "inherit",
    });

    prismaClient = new PrismaClient({
      datasources: { db: { url: databaseUrl } },
      log: ["query"],
    });

    await prismaClient.$connect();
    console.log("Prisma connected to test Postgres container");
  } catch (e) {
    console.log("error on setup: ", e);
  }
});

afterAll(async () => {
  if (prismaClient) await prismaClient.$disconnect();
  if (postgresContainer) await postgresContainer.stop();

  console.log("Test container stopped");
});

export { prismaClient };
