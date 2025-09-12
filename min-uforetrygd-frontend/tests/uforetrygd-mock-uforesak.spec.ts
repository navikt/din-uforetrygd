import {expect, test} from '@playwright/test';


test.describe('Uforetrygd Content and Status Display', () => {

  test('should display main page content correctly', async ({page}) => {
    await page.goto('');

    await expect(page).toHaveTitle("Din uføretrygd");
    await expect(page.locator('body')).toBeVisible();
  });


  test('should have functioning sort controls for hendelser', async ({page}) => {
    await page.goto('');

    const hendelserHeading = page.getByRole('heading', {name: 'Dette har skjedd i saken din'});
    await expect(hendelserHeading).toBeVisible();

    const hendelserSection = page.locator('section[aria-label="Hendelser i saken din"]');

    await hendelserSection.click();
    const sortControl = page.getByRole('combobox', {name: 'Sorter etter'});

    await expect(sortControl).toBeVisible();
    await sortControl.selectOption('asc');

    await expect(page.getByText('SAK OPPRETTET')).toHaveCount(6);
    await sortControl.selectOption('desc');

    await expect(page.getByText('Automatisk omregnet')).toHaveCount(3);
  });

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
