import { configDefaults, defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    // Executed by node --test in the receiver-isolation CI workflow.
    exclude: [...configDefaults.exclude, "scripts/__tests__/build-webhook-receiver.test.mjs"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
