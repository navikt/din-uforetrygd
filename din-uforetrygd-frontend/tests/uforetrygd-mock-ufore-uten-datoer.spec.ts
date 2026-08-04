import { expect, test } from '@playwright/test'
import { dismissCookieBanner, getValueCellByLabel } from './test-helpers'

test.describe('Ufore uten datoer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('')
    await dismissCookieBanner(page)
  })

  test('renders ufore data even when dates are missing', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Din uføretrygd/i })).toBeVisible()
  })

  test('displays current active uføretrygd information', async ({ page }) => {
    await expect(getValueCellByLabel(page, 'Uføretidspunkt')).toBeEmpty()
    await expect(getValueCellByLabel(page, 'Innvilget fra')).toBeEmpty()
    await expect(getValueCellByLabel(page, /Registrert forventet inntekt/i)).toHaveText('150 000 kr')
    await expect(getValueCellByLabel(page, 'Inntektsgrense')).toHaveText('49 611 kr')
  })
})
