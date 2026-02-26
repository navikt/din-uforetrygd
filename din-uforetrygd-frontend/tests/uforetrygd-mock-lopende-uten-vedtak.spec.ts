import { expect, test } from '@playwright/test'

test.describe('Lopende uforesak uten vedtak', () => {
  test('Viser ingen kort for bruker uten vedtak men med lopende ufore', async ({ page }) => {
    await page.goto('')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Din uføretrygd/i })).toBeVisible()

    const dittVedtak = page.getByText('Kort om saken din')
    await expect(dittVedtak).not.toBeVisible()
  })
})
