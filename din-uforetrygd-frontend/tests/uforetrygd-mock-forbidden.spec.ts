import { expect, test } from '@playwright/test'
import { dismissCookieBanner } from './test-helpers'

test.describe('Forbidden login level scenario', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('')
    await dismissCookieBanner(page)
  })

  test('should not display main uføretrygd content', async ({ page }) => {
    const content = await page.content()
    expect(/uføregrad|inntektsgrense|vedtak/i.test(content)).toBeFalsy()
  })

  test('displays login upgrade instructions', async ({ page }) => {
    const content = await page.content()
    expect(/logg inn|BankID|høyere nivå/i.test(content)).toBeTruthy()
  })

  test('displays appropriate error status information', async ({ page }) => {
    const content = await page.content()
    expect(/403|ikke tilgang|adgang nektet|FORBIDDEN/i.test(content)).toBeTruthy()
  })
})
