import { test, expect } from '@playwright/test'

test.describe('Ingen uforesak', () => {
  test('renders page for ingen sak', async ({ page }) => {
    await page.goto('')
    await expect(page.getByRole('heading', { name: /Din uføretrygd/i })).toBeVisible()
  })

  test('does not display saksoversikt', async ({ page }) => {
    await page.goto('')

    const saksoversiktHeading = page.getByRole('heading', { name: 'Saksoversikt' })
    await expect(saksoversiktHeading).not.toBeVisible()

    const hendelserHeading = page.getByRole('heading', { name: 'Dette har skjedd i saken din' })
    await expect(hendelserHeading).not.toBeVisible()

    const hendelserSection = page.locator('section[aria-label="Hendelser i saken din"]')
    await expect(hendelserSection).not.toBeVisible()

    const documentsSection = page.locator('[aria-label="Dokumenter knyttet til saken din"]')
    await expect(documentsSection).not.toBeVisible()
  })

  test('displays standard guidepanel for users without uforetrygd', async ({ page }) => {
    await page.goto('')

    const guidepanel = page.getByText('Du har ikke uføretrygd')
    await expect(guidepanel).toBeVisible()
  })

  test('Bekreft at riktige lenker og paneler vises til bruker', async ({ page }) => {
    await page.goto('')

    //Lenkeboks
    const inntektsplanlegger = page.getByText('Meld fra om endring i inntekt')
    const ettersendDokumentasjon = page.getByText('Ettersend dokumentasjon')

    await expect(inntektsplanlegger).not.toBeVisible()
    await expect(ettersendDokumentasjon).not.toBeVisible()

    //Lenker som skal vises
    const soknadUforetrygd = page.getByText('Søknad om uføretrygd')
    const soknadBarnetrygdUforetrygd = page.getByText('Søknad om barnetillegg til uføretrygd')

    await expect(soknadUforetrygd).toBeVisible()
    await expect(soknadBarnetrygdUforetrygd).toBeVisible()

    //Lenker som skal ikke vises
    const endreKontonummer = page.getByText('Endre kontonummer')
    const okonomisketillegg = page.getByText('Økonomiske tillegg og andre ordninger')
    const gradertUforeEndring = page.getByText('Søknad om endret inntektsgrense ved gradert uføretrygd')

    await expect(endreKontonummer).not.toBeVisible()
    await expect(okonomisketillegg).not.toBeVisible()
    await expect(gradertUforeEndring).not.toBeVisible()
  })
})
