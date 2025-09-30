import { test, expect } from '@playwright/test'

test.describe('Sak til behandling ingen ufore', () => {
  test('Viser sak til behandling og ingen ufore boks', async ({ page }) => {
    await page.goto('')
    await expect(page.getByRole('heading', { name: /Din uføretrygd/i })).toBeVisible()

    const dittVedtakBoks = page.getByText('Kort om saken din')
    await expect(dittVedtakBoks).not.toBeVisible()

    const sakTilBehandlingBoks = page.getByText('Søknad under behandling')
    await expect(sakTilBehandlingBoks).toBeVisible()
  })

  //TODO: Lanser hendelseskomponenten
  /*
  test('knapp endrer fokus', async ({ page }) => {
    await page.goto('')
    const seHendelserISakenDinButton = page.getByText('Se siste hendelser i saken')
    await expect(seHendelserISakenDinButton).toBeVisible()

    await seHendelserISakenDinButton.click()

    const focusedHendelserBoks = page.locator('section[aria-label="Hendelser i saken din"]')
    await expect(focusedHendelserBoks).toBeFocused()
  })
  */
})
