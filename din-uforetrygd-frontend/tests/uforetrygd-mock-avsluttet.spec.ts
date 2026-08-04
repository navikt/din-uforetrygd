import { expect, test } from '@playwright/test'
import { dismissCookieBanner } from './test-helpers'

test.describe('Avsluttet uforesak med dokumenter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('')
    await dismissCookieBanner(page)
  })

  test('renders page for avsluttet sak', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Din uføretrygd/i })).toBeVisible()
  })

  test('displays documents in saksoversikt', async ({ page }) => {
    const cookieBanner = page.locator('#consent-banner-dialog')
    await expect(cookieBanner).not.toBeVisible()

    const documentsSection = page.locator('section[aria-label="Dokumenter knyttet til saken din"]')
    await expect(documentsSection).toBeVisible()

    await documentsSection.click()

    const alderspensjonDocument = page.getByText('Vedtak - innvilgelse av alderspensjon (auto)').first()
    await expect(alderspensjonDocument).toBeVisible()
    await alderspensjonDocument.click()

    const rettigheterDocument = page.getByRole('link', { name: 'Dine rettigheter og plikter' })
    await expect(rettigheterDocument).toBeVisible()

    const opplysningerDocument = page.getByRole('link', { name: 'Opplysninger brukt i beregningen' })
    await expect(opplysningerDocument).toBeVisible()

    const pensjonDocument = page.getByRole('link', { name: 'Dette er din månedlige pensjon før skatt' })
    await expect(pensjonDocument).toBeVisible()

    const documentLink = page.getByRole('link', { name: 'Åpne vedtak - innvilgelse av alderspensjon (auto)' }).first()
    await expect(documentLink).toBeVisible()
    await expect(documentLink).toHaveAttribute('href')
  })

  test('displays standard guidepanel for users without uforetrygd', async ({ page }) => {
    const guidepanel = page.getByText('Du har ikke uføretrygd')
    await expect(guidepanel).toBeVisible()
  })
})
