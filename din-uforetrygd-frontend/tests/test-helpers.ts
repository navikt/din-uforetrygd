import { expect, type Page } from '@playwright/test'

export const dismissCookieBanner = async (page: Page) => {
  const acceptCookiesButton = page.locator('#decorator-header').getByRole('button', { name: /^Ja$/ }).first()

  try {
    await acceptCookiesButton.waitFor({ state: 'visible', timeout: 4_000 })
    await acceptCookiesButton.click()
    await expect(acceptCookiesButton).toBeHidden()
  } catch {
    return
  }
}

export const getValueCellByLabel = (page: Page, label: string | RegExp) =>
  page
    .getByRole('row')
    .filter({ has: page.getByRole('cell', { name: label }) })
    .getByRole('cell')
    .nth(1)
