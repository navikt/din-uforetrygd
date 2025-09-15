import { defineConfig, devices } from '@playwright/test'

const scenarios = [
  { name: 'uforesak', port: 3000, testFile: '**/uforetrygd-mock-uforesak.spec.ts' },
  { name: 'avsluttet', port: 3001, testFile: '**/uforetrygd-mock-avsluttet.spec.ts' },
  { name: 'forbidden', port: 3002, testFile: '**/uforetrygd-mock-forbidden.spec.ts' },
  { name: 'gradert', port: 3003, testFile: '**/uforetrygd-mock-gradert.spec.ts' },
  { name: 'lopende-uten-vedtak', port: 3004, testFile: '**/uforetrygd-mock-lopende-uten-vedtak.spec.ts' },
  {
    name: 'sak-til-behandling-ingen-ufore',
    port: 3005,
    testFile: '**/uforetrygd-mock-sak-til-behandling-ingen-ufore.spec.ts',
  },
  { name: 'ufore-og-behandling', port: 3006, testFile: '**/uforetrygd-mock-ufore-og-behandling.spec.ts' },
  { name: 'ingen-uforesak', port: 3007, testFile: '**/uforetrygd-mock-ingen-uforesak.spec.ts' },
  { name: 'ufore-uten-datoer', port: 3008, testFile: '**/uforetrygd-mock-ufore-uten-datoer.spec.ts' },
]

const browsers = [
  { name: 'chromium', device: devices['Desktop Chrome'] },
  { name: 'mobile', device: devices['iPhone 12'] },
]

const projects = scenarios.flatMap((scenario) =>
  browsers.map((browser) => ({
    name: `${scenario.name}-${browser.name}`,
    testMatch: scenario.testFile,
    use: {
      ...browser.device,
      baseURL: `http://localhost:${scenario.port}/uforetrygd/selvbetjening`,
    },
  }))
)

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  reporter: [
    ['list'],
    ['html', { open: 'never' }], // never auto-open
  ],
  use: {
    headless: true,
    trace: 'on-first-retry',
    actionTimeout: 60000,
    navigationTimeout: 60000,
    // Disable caching
    extraHTTPHeaders: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    ignoreHTTPSErrors: true,
    // Disable browser cache
    launchOptions: {
      args: [
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu-sandbox',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-field-trial-config',
        '--disable-back-forward-cache',
        '--disable-ipc-flooding-protection',
        '--aggressive-cache-discard',
        '--memory-pressure-off',
        '--max_old_space_size=4096',
        '--disable-blink-features=AutomationControlled'
      ]
    }
  },
  webServer: {
    command: 'npm run dev:all',
    url: 'http://localhost:3000/uforetrygd/selvbetjening',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects,
})
