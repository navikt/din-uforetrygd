import { test, expect } from '@playwright/test'


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

  test('should not display navigation or interactive elements', async ({ page }) => {
    await page.goto('')

    const buttons = page.locator('button:not([aria-hidden="true"])')
    const buttonCount = await buttons.count()
    expect(buttonCount).toBeLessThanOrEqual(1)

    const documentLinks = page.locator('a[href*="dokument"]')
    expect(await documentLinks.count()).toBe(0)
  })

  test('displays appropriate error status information', async ({ page }) => {
    await page.goto('')

    const content = await page.content()
    expect(/403|ikke tilgang|adgang nektet|FORBIDDEN/i.test(content)).toBeTruthy()
  })
})
