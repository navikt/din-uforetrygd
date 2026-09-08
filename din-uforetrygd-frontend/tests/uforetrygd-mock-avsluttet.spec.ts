import { expect, test } from '@playwright/test'
import { dismissCookieBanner } from './test-helpers'

test.describe('Avsluttet uforesak med dokumenter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('?scenario=avsluttet')
    await dismissCookieBanner(page)
  })

  test('renders page for avsluttet sak', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Din uføretrygd/i })).toBeVisible()
  })

  test('displays documents from dokumentoversikt link', async ({ page }) => {
    const cookieBanner = page.locator('#consent-banner-dialog')
    await expect(cookieBanner).not.toBeVisible()

    const documentsLink = page.getByRole('link', { name: 'Dokumenter knyttet til saken din' })
    await expect(documentsLink).toBeVisible()
  })

  test('displays standard guidepanel for users without uforetrygd', async ({ page }) => {
    const guidepanel = page.getByText('Du har ikke uføretrygd')
    await expect(guidepanel).toBeVisible()
  })
})
