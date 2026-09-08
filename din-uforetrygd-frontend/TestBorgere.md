# Test-borgere

Vi bruker [Dolly](https://dolly.ekstern.dev.nav.no/) til å generere testdata.

### Vanlig uføretrygd

1. Under **Pensjon** huk av for **Har uføretrygd**.
2. Gå videre og fyll ut det du trenger for ditt spesifikke scenario.
   - Vanligvis må virkningstidspunktet settes tilbake i tid.

### Med fullmektig

1. Under **Pensjon** huk av for **Har uføretrygd**.
2. Under **Personinformasjon** og huk av for **Har fullmakt**.
3. Gå videre og velg temaet **Uføretrygd - UFO**.
4. Logg inn som fullmektig, ikke personen du opprettet. Fullmektiges fødselsnummer står litt ned i informasjonen til den nye personen.

### Med verge

1. Under **Pensjon** huk av for **Har uføretrygd**.
2. Under **Personinformasjon** huk av for **Vergemål**.
3. Gå videre og fyll ut følgende under **Vergemål**:
   - Sett **Sakstype** til **Voksen**.
   - Sett **Gyldig f.o.m.**.
   - Under **Tjenesteområde**, velg **tjenestevirksomhet Nav** og minst én tjenesteoppgave.
   - De andre feltene kan ha valgfri verdi.
   - Les mer i [REPR-dokumentasjonen om å opprette testdata](https://repr-docs.ansatt.dev.nav.no/ekstern/faglig.html#_hvordan_opprette_test_data).
4. Logg inn som vergen, ikke personen du opprettet. Vergens fødselsnummer står litt ned i informasjonen til den nye personen.
