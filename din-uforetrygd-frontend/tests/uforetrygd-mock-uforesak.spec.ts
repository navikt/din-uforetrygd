import { expect, test } from '@playwright/test'
import { dismissCookieBanner } from './test-helpers'

test.describe('Uforetrygd Content and Status Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('')
    await dismissCookieBanner(page)
  })

  test('should display main page content correctly', async ({ page }) => {
    await expect(page).toHaveTitle('Din uføretrygd - nav.no')
    await expect(page.locator('body')).toBeVisible()
  })

  test('Bekreft at riktige lenker og paneler vises til bruker', async ({ page }) => {
    //Lenkeboks
    const inntektsplanlegger = page.getByText('Meld fra om endring i inntekt')
    const ettersendDokumentasjon = page.getByText('Ettersend dokumentasjon')

    await expect(inntektsplanlegger).toBeVisible()
    await expect(ettersendDokumentasjon).toBeVisible()

    //Lenker som skal vises
    const soknadUforetrygd = page.getByText('Søknad om uføretrygd')
    const soknadBarnetrygdUforetrygd = page.getByText('Søknad om barnetillegg til uføretrygd')
    const endreKontonummer = page.getByText('Endre kontonummer')
    const okonomisketillegg = page.getByText('Økonomiske tillegg og andre ordninger')

    await expect(okonomisketillegg).toBeVisible()
    await expect(soknadUforetrygd).toBeVisible()
    await expect(soknadBarnetrygdUforetrygd).toBeVisible()
    await expect(endreKontonummer).toBeVisible()

    //Lenker som skal ikke vises
    const gradertUforeEndring = page.getByText('Søknad om endret inntektsgrense ved gradert uføretrygd')

    await expect(gradertUforeEndring).not.toBeVisible()
  })
})
