import { test, expect } from '@playwright/test'

test.describe('Avsluttet uforesak med dokumenter', () => {

  test('renders page for avsluttet sak', async ({ page }) => {
    await page.goto('')
    await expect(page.getByRole('heading', { name: /Din uføretrygd/i })).toBeVisible()
  })

  test('displays documents in saksoversikt', async ({ page }) => {
    await page.goto('')

    const documentsSection = page.locator('[aria-label="Dokumenter knyttet til saken din"]')
    await expect(documentsSection).toBeVisible()

    await documentsSection.click()

    const alderspensjonDocument = page.getByText('Vedtak - innvilgelse av alderspensjon (auto)').first()
    await expect(alderspensjonDocument).toBeVisible()
    await alderspensjonDocument.click()

    const rettigheterDocument = page.getByText('Dine rettigheter og plikter')
    await expect(rettigheterDocument).toBeVisible()

    const opplysningerDocument = page.getByText('Opplysninger brukt i beregningen')
    await expect(opplysningerDocument).toBeVisible()

    const pensjonDocument = page.getByText('Dette er din månedlige pensjon før skatt')
    await expect(pensjonDocument).toBeVisible()

    const documentLink = page.getByText('Åpne vedtak - innvilgelse av alderspensjon (auto)').first()
    await expect(documentLink).toBeVisible()
    await expect(documentLink).toHaveAttribute('href')
  })

  test('displays standard guidepanel for users without uforetrygd', async ({ page }) => {
    await page.goto('')

    const guidepanel = page.getByText("Du har ikke uføretrygd")
    await expect(guidepanel).toBeVisible()
 })

})
