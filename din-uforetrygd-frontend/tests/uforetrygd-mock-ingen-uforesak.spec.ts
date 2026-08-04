import { expect, test } from '@playwright/test'
import { dismissCookieBanner } from './test-helpers'

test.describe('Ingen uforesak', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('')
    await dismissCookieBanner(page)
  })

  test('renders page for ingen sak', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Din uføretrygd/i })).toBeVisible()
  })

  test('displays standard guidepanel for users without uforetrygd', async ({ page }) => {
    const guidepanel = page.getByRole('heading', { name: 'Du har ikke uføretrygd' })
    await expect(guidepanel).toBeVisible()
  })

  test('Bekreft at riktige lenker og paneler vises til bruker', async ({ page }) => {
    //Lenkeboks
    const inntektsplanlegger = page.getByRole('link', { name: /Meld fra om endring i inntekt/i })
    const ettersendDokumentasjon = page.getByRole('link', { name: /Ettersend dokumentasjon/i })

    await expect(inntektsplanlegger).not.toBeVisible()
    await expect(ettersendDokumentasjon).not.toBeVisible()

    //Lenker som skal vises
    const soknadUforetrygd = page.getByRole('link', { name: /Søknad om uføretrygd/i })
    const soknadBarnetrygdUforetrygd = page.getByRole('link', { name: /Søknad om barnetillegg til uføretrygd/i })

    await expect(soknadUforetrygd).toBeVisible()
    await expect(soknadBarnetrygdUforetrygd).toBeVisible()

    //Lenker som skal ikke vises
    const endreKontonummer = page.getByRole('link', { name: /Endre kontonummer/i })
    const okonomisketillegg = page.getByRole('link', { name: /Økonomiske tillegg og andre ordninger/i })
    const gradertUforeEndring = page.getByRole('link', { name: /Søknad om endret inntektsgrense ved gradert uføretrygd/i })

    await expect(endreKontonummer).not.toBeVisible()
    await expect(okonomisketillegg).not.toBeVisible()
    await expect(gradertUforeEndring).not.toBeVisible()
  })
})
