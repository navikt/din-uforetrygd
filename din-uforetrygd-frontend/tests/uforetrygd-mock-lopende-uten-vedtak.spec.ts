import { expect, test } from '@playwright/test'
import { dismissCookieBanner } from './test-helpers'

test.describe('Lopende uforesak uten vedtak', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('')
    await dismissCookieBanner(page)
  })

  test('Viser ingen kort for bruker uten vedtak men med lopende ufore', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Din uføretrygd/i })).toBeVisible()

    const vedtakSection = page.locator('section[aria-label="Detaljer om saken din"]')
    await expect(vedtakSection).toHaveCount(0)
  })
})
