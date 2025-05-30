import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    workspace: [
      {
        test: {
          name: "unit",
          globals: true,
          environment: "node",
          include: ["src/**/*unit.spec.ts"],
        },
      },
      {
        test: {
          name: "integration",
          globals: true,
          environment: "node",
          include: ["src/**/*.integ.spec.ts"],
          setupFiles: ["./test/setupIntegration.ts"],
        },
      },
    ],
  },
});
