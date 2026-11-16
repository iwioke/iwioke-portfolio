import {defineConfig, devices} from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3010",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3010",
    url: "http://127.0.0.1:3010/",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {name: "chromium", use: {...devices["Desktop Chrome"]}},
    {name: "mobile", use: {...devices["iPhone 13"]}},
  ],
});
