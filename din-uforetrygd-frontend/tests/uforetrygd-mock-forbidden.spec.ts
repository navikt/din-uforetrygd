import { expect, test } from '@playwright/test'

test.describe('Forbidden login level scenario', () => {
  test('should not display main uføretrygd content', async ({ page }) => {
    await page.goto('')

    const content = await page.content()
    expect(/uføregrad|inntektsgrense|vedtak/i.test(content)).toBeFalsy()
  })

  test('displays login upgrade instructions', async ({ page }) => {
    await page.goto('')

    const content = await page.content()
    expect(/logg inn|BankID|høyere nivå/i.test(content)).toBeTruthy()
  })

  test('displays appropriate error status information', async ({ page }) => {
    await page.goto('')

    const content = await page.content()
    expect(/403|ikke tilgang|adgang nektet|FORBIDDEN/i.test(content)).toBeTruthy()
  })
})
