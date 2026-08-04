import { defineConfig, devices } from '@playwright/test'

const scenarios = [
  { name: 'uforesak', mockScenario: 'default', testFile: '**/uforetrygd-mock-uforesak.spec.ts' },
  { name: 'avsluttet', mockScenario: 'avsluttet', testFile: '**/uforetrygd-mock-avsluttet.spec.ts' },
  { name: 'forbidden', mockScenario: 'forbidden', testFile: '**/uforetrygd-mock-forbidden.spec.ts' },
  { name: 'gradert', mockScenario: 'gradert', testFile: '**/uforetrygd-mock-gradert.spec.ts' },
  {
    name: 'lopende-uten-vedtak',
    mockScenario: 'har-lopende',
    testFile: '**/uforetrygd-mock-lopende-uten-vedtak.spec.ts',
  },
  {
    name: 'sak-til-behandling-ingen-ufore',
    mockScenario: 'sak-behandling',
    testFile: '**/uforetrygd-mock-sak-til-behandling-ingen-ufore.spec.ts',
  },
  {
    name: 'ufore-og-behandling',
    mockScenario: 'ufore-behandling',
    testFile: '**/uforetrygd-mock-ufore-og-behandling.spec.ts',
  },
  { name: 'ingen-uforesak', mockScenario: 'ingen-uforesak', testFile: '**/uforetrygd-mock-ingen-uforesak.spec.ts' },
  {
    name: 'ufore-uten-datoer',
    mockScenario: 'ufore-uten-datoer',
    testFile: '**/uforetrygd-mock-ufore-uten-datoer.spec.ts',
  },
]

const browsers = [
  { name: 'chromium', device: devices['Desktop Chrome'] },
  { name: 'firefox', device: devices['Desktop Firefox'] },
  { name: 'webkit', device: devices['Desktop Safari'] },
  { name: 'mobile', device: devices['iPhone 12'] },
]

const projects = scenarios.flatMap((scenario) =>
  browsers.map((browser) => ({
    name: `${scenario.name}-${browser.name}`,
    testMatch: scenario.testFile,
    use: {
      ...browser.device,
      baseURL: 'http://localhost:3000/uforetrygd/selvbetjening',
      extraHTTPHeaders: {
        'x-mock-scenario': scenario.mockScenario,
      },
    },
  }))
)

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }], // never auto-open
  ],
  use: {
    headless: true,
    trace: 'on-first-retry',
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },
  webServer: {
    command: 'npm run dev:playwright',
    url: 'http://localhost:3000/uforetrygd/selvbetjening',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects,
})
