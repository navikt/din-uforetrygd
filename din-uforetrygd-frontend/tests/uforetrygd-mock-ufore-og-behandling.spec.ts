import { expect, test } from '@playwright/test'
import { dismissCookieBanner, getValueCellByLabel } from './test-helpers'

test.describe('Har ufore og sak til behandling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('')
    await dismissCookieBanner(page)
  })

  test('displays current active uføretrygd information', async ({ page }) => {
    await expect(getValueCellByLabel(page, 'Uføretidspunkt')).toHaveText('01.10.2020')
    await expect(getValueCellByLabel(page, 'Innvilget fra')).toHaveText('01.12.2024')
    await expect(getValueCellByLabel(page, /Registrert forventet inntekt/i)).toHaveText('0 kr')
    await expect(getValueCellByLabel(page, 'Inntektsgrense')).toHaveText('49 611 kr')
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
