import { test, expect } from '@playwright/test'

test.describe('Gradert ufore scenario', () => {
  test('displays main heading and gradert uføretrygd information', async ({ page }) => {
    await page.goto('')
    await expect(page.getByRole('heading', { name: /Din uføretrygd/i })).toBeVisible()

    await expect(page.getByText('Uføregrad: 50 prosent')).toBeVisible()
  })

  test('displays current vedtak details with dates', async ({ page }) => {
    await page.goto('')

    await expect(page.getByText('Uføretidspunkt: 01.10.2020')).toBeVisible()
    await expect(page.getByText('Uføretrygd innvilget fra: 01.12.2024')).toBeVisible()
    await expect(page.getByText('Registrert forventet inntekt: 0 kr')).toBeVisible()
    await expect(page.getByText('Inntektsgrense: 49 611 kr').first()).toBeVisible()
  })

  test('displays appropriate lenkekort for gradert ufore', async ({ page }) => {
    await page.goto('')

    const inntektsplanlegger = page.getByText('Meld fra om endring i inntekt')
    const ettersendDokumentasjon = page.getByText('Ettersend dokumentasjon')

    await expect(inntektsplanlegger).toBeVisible()
    await expect(ettersendDokumentasjon).toBeVisible()
  })
})
