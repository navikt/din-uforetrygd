import { test, expect } from '@playwright/test'

test.describe('Har ufore og sak til behandling', () => {


  test('displays current active uføretrygd information', async ({ page }) => {
    await page.goto('')

    await expect(page.getByText('Uføretidspunkt: 01.10.2020')).toBeVisible()
    await expect(page.getByText('Uføretrygd innvilget fra: 01.12.2024')).toBeVisible()
    await expect(page.getByText('Registrert forventet inntekt: 0 kr')).toBeVisible()
    await expect(page.getByText('Inntektsgrense: 49 611 kr').first()).toBeVisible()
  })

  test('Bekreft at riktige lenker og paneler vises til bruker', async ({ page }) => {
    await page.goto('')

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
