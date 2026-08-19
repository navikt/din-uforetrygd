import { expect, test } from '@playwright/test'
import { dismissCookieBanner } from './test-helpers'

test.describe('Sak til behandling ingen ufore', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('')
    await dismissCookieBanner(page)
  })

  test('Viser sak til behandling og ingen ufore boks', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Din uføretrygd/i })).toBeVisible()

    const vedtakSection = page.locator('section[aria-label="Detaljer om saken din"]')
    await expect(vedtakSection).toHaveCount(0)
    const dittVedtakHeader = page.getByRole('heading', { name: 'Om saken din' })
    await expect(dittVedtakHeader).not.toBeVisible()

    const sakTilBehandlingBoks = page.getByText('Søknaden din venter på behandling.')
    await expect(sakTilBehandlingBoks).toBeVisible()
  })
})
