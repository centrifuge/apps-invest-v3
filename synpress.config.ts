import { defineConfig, devices } from '@playwright/test'

/**
 * Synpress-specific Playwright configuration
 * This configuration is optimized for Web3 wallet testing with Synpress
 */
export default defineConfig({
  testDir: './test',
  fullyParallel: false, // Disable for wallet tests to avoid conflicts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1, // Use single worker for wallet tests
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { outputFolder: 'synpress-report' }], ['list']],
  timeout: 60000,
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3003',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    /* Extended timeout for wallet interactions */
    actionTimeout: 30000,
  },
  projects: [
    {
      name: 'synpress-chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: false, // Show browser for wallet interactions
      },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3003',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
