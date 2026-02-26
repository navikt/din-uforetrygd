import { expect, test } from '@playwright/test'

test.describe('Ufore uten datoer', () => {
  test('renders ufore data even when dates are missing', async ({ page }) => {
    await page.goto('')
    await expect(page.getByRole('heading', { name: /Din uføretrygd/i })).toBeVisible()
  })

  test('displays current active uføretrygd information', async ({ page }) => {
    await page.goto('')

    await expect(page.getByText('Uføretidspunkt')).not.toBeVisible()
    await expect(page.getByText('Uføretrygd innvilget fra')).not.toBeVisible()
    await expect(page.getByText('Registrert forventet inntekt: 150 000 kr')).toBeVisible()
    await expect(page.getByText('Inntektsgrense: 49 611 kr').first()).toBeVisible()
  })
})
