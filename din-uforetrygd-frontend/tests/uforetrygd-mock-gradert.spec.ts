import { expect, test } from '@playwright/test'
import { dismissCookieBanner, getValueCellByLabel } from './test-helpers'

test.describe('Gradert ufore scenario', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('')
    await dismissCookieBanner(page)
  })

  test('displays main heading and gradert uføretrygd information', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Din uføretrygd/i })).toBeVisible()
    await expect(getValueCellByLabel(page, 'Uføregrad')).toHaveText('50 prosent')
  })

  test('displays current vedtak details with dates', async ({ page }) => {
    await expect(getValueCellByLabel(page, 'Uføretidspunkt')).toHaveText('01.10.2020')
    await expect(getValueCellByLabel(page, 'Innvilget fra')).toHaveText('01.12.2024')
    await expect(getValueCellByLabel(page, /Registrert forventet inntekt/i)).toHaveText('0 kr')
    await expect(getValueCellByLabel(page, 'Inntektsgrense')).toHaveText('49 611 kr')
  })

  test('displays appropriate lenkekort for gradert ufore', async ({ page }) => {
    const inntektsplanlegger = page.getByText('Meld fra om endring i inntekt')
    const ettersendDokumentasjon = page.getByText('Ettersend dokumentasjon')

    await expect(inntektsplanlegger).toBeVisible()
    await expect(ettersendDokumentasjon).toBeVisible()
  })
})
