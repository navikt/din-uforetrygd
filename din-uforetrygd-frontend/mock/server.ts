import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 8080

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      callback(null, true)
    },
  })
)

const uforeMock = {
  pid: '81549300',
  loggetInnSom: '81549300',
  saker: [
    {
      type: 'UFORETRYGD',
      status: 'LOPENDE',
    },
  ],
  hasIverksattVedtak: true,
  uforevedtak: {
    uforegrad: 100,
    virkFom: '2024-12-01',
    uforetidspunkt: '2020-10-01',
    inntektsgrense: 49611,
    sumAvForventedeInntekter: 150000,
    hasBarnetilleggFellesBarn: false,
    hasBarnetilleggSaerkullsbarn: false,
    hasGjenlevendeTillegg: false,
    hasVarigTilrettelagtArbeid: false,
  },
  innloggingstype: 'LEVEL4',
  harGammelFullmaktmottaker: false,
  hendelser: [
    {
      type: 'OMREGNET',
      gjelder: null,
      arsak: null,
      status: null,
      endretDato: '2024-11-29T13:43:02',
      opprettetAv: 'AUTOMATISK_PROSESS',
    },
    {
      type: 'INTERNKONTROLL',
      gjelder: 'REVURD',
      arsak: 'ENDRET_OPPTJENING',
      status: 'FERDIG',
      endretDato: '2024-11-29T13:43:02',
      opprettetAv: 'AUTOMATISK_PROSESS',
    },
    {
      type: 'REVURD',
      gjelder: 'REVURD',
      arsak: 'ENDRET_OPPTJENING',
      status: 'FERDIG',
      endretDato: '2024-11-29T13:43:02',
      opprettetAv: 'AUTOMATISK_PROSESS',
    },
    {
      type: 'OMREGNET',
      gjelder: null,
      arsak: null,
      status: null,
      endretDato: '2024-11-29T10:18:43',
      opprettetAv: 'AUTOMATISK_PROSESS',
    },
    {
      type: 'INTERNKONTROLL',
      gjelder: 'REVURD',
      arsak: 'ENDRET_OPPTJENING',
      status: 'FERDIG',
      endretDato: '2024-11-29T10:18:43',
      opprettetAv: 'AUTOMATISK_PROSESS',
    },
    {
      type: 'REVURD',
      gjelder: 'REVURD',
      arsak: 'ENDRET_OPPTJENING',
      status: 'FERDIG',
      endretDato: '2024-11-29T10:18:43',
      opprettetAv: 'AUTOMATISK_PROSESS',
    },
    {
      type: 'OMREGNET',
      gjelder: null,
      arsak: null,
      status: null,
      endretDato: '2024-11-28T19:32:47',
      opprettetAv: 'AUTOMATISK_PROSESS',
    },
    {
      type: 'INTERNKONTROLL',
      gjelder: 'REVURD',
      arsak: 'ENDRET_OPPTJENING',
      status: 'FERDIG',
      endretDato: '2024-11-28T19:32:47',
      opprettetAv: 'AUTOMATISK_PROSESS',
    },
    {
      type: 'REVURD',
      gjelder: 'REVURD',
      arsak: 'ENDRET_OPPTJENING',
      status: 'FERDIG',
      endretDato: '2024-11-28T19:32:43',
      opprettetAv: 'AUTOMATISK_PROSESS',
    },
    {
      type: 'VEDTAK_FATTET',
      gjelder: 'REVURD',
      arsak: 'ENDRET_OPPTJENING',
      status: 'FERDIG',
      endretDato: '2024-11-27T13:45:04',
      opprettetAv: 'AUTOMATISK_PROSESS',
    },
    {
      type: 'OMREGNET',
      gjelder: null,
      arsak: null,
      status: null,
      endretDato: '2024-11-27T13:45:04',
      opprettetAv: 'AUTOMATISK_PROSESS',
    },
    {
      type: 'REVURD',
      gjelder: 'REVURD',
      arsak: 'ENDRET_OPPTJENING',
      status: 'FERDIG',
      endretDato: '2024-11-27T13:45:04',
      opprettetAv: 'AUTOMATISK_PROSESS',
    },
    {
      type: 'VEDTAK_FATTET',
      gjelder: 'FORSTEG_BH',
      arsak: 'NY_SOKNAD',
      status: 'FERDIG',
      endretDato: '2024-10-07T09:36:59',
      opprettetAv: 'SAKSBEHANDLER',
    },
    {
      type: 'FORSTEG_BH',
      gjelder: 'FORSTEG_BH',
      arsak: 'NY_SOKNAD',
      status: 'FERDIG',
      endretDato: '2024-10-07T09:32:16',
      opprettetAv: 'UKJENT',
    },
    {
      type: 'SAK_OPPRETTET',
      gjelder: null,
      arsak: null,
      status: null,
      endretDato: '2024-10-07T09:32:15',
      opprettetAv: 'UKJENT',
    },
  ],
  journalposter: [
    {
      id: '453972899',
      tittel: 'Vedtak - innvilgelse av alderspensjon (auto)',
      opprettetAv: 'NAV',
      opprettetDato: '2025-03-14T11:36:39',
      dokumenter: [
        {
          tittel: 'Vedtak - innvilgelse av alderspensjon (auto)',
          dokumentInfoId: '454376702',
        },
        {
          tittel: 'Dine rettigheter og plikter',
          dokumentInfoId: '454376703',
        },
        {
          tittel: 'Opplysninger brukt i beregningen',
          dokumentInfoId: '454376704',
        },
        {
          tittel: 'Dette er din månedlige pensjon før skatt',
          dokumentInfoId: '454376705',
        },
      ],
    },
    {
      id: '453972898',
      tittel: 'Søknad om alderspensjon',
      opprettetAv: 'BRUKER',
      opprettetDato: '2025-03-14T10:36:19',
      dokumenter: [
        {
          tittel: 'Søknad om alderspensjon',
          dokumentInfoId: '454376701',
        },
      ],
    },
  ],
}

const gradertUforeMock = {
  pid: '81549300',
  loggetInnSom: '81549300',
  saker: [
    {
      type: 'UFORETRYGD',
      status: 'LOPENDE',
    },
  ],
  hasIverksattVedtak: true,
  uforevedtak: {
    uforegrad: 50,
    virkFom: '2024-12-01',
    uforetidspunkt: '2020-10-01',
    inntektsgrense: 49611,
    sumAvForventedeInntekter: 0,
    hasBarnetilleggFellesBarn: false,
    hasBarnetilleggSaerkullsbarn: false,
    hasGjenlevendeTillegg: false,
    hasVarigTilrettelagtArbeid: false,
  },
  innloggingstype: 'LEVEL4',
  harGammelFullmaktmottaker: false,
}

const ingenUforesakMock = {
  pid: '81549300',
  loggetInnSom: '81549300',
  saker: [],
  hasIverksattVedtak: false,
  uforevedtak: null,
  innloggingstype: 'LEVEL4',
  harGammelFullmaktmottaker: false,
}

const harUforeOgSakTilBehandlingMock = {
  pid: '81549300',
  loggetInnSom: '81549300',
  saker: [
    {
      type: 'UFORETRYGD',
      status: 'TIL_BEHANDLING',
    },
  ],
  hasIverksattVedtak: true,
  uforevedtak: {
    uforegrad: 100,
    virkFom: '2024-12-01',
    uforetidspunkt: '2020-10-01',
    inntektsgrense: 49611,
    sumAvForventedeInntekter: 0,
    hasBarnetilleggFellesBarn: false,
    hasBarnetilleggSaerkullsbarn: false,
    hasGjenlevendeTillegg: false,
    hasVarigTilrettelagtArbeid: false,
  },
  innloggingstype: 'LEVEL4',
  harGammelFullmaktmottaker: false,
}

const harSakTilBehandlingOgIngenUforeMock = {
  pid: '81549300',
  loggetInnSom: '81549300',
  saker: [
    {
      type: 'UFORETRYGD',
      status: 'TIL_BEHANDLING',
    },
  ],
  hasIverksattVedtak: false,
  uforevedtak: null,
  innloggingstype: 'LEVEL4',
  harGammelFullmaktmottaker: false,
}

const harLopendeUforeSakOgIngenVedtakMock = {
  pid: '81549300',
  loggetInnSom: '81549300',
  saker: [
    {
      type: 'UFORETRYGD',
      status: 'LOPENDE',
    },
  ],
  hasIverksattVedtak: false,
  uforevedtak: null,
  innloggingstype: 'LEVEL4',
  harGammelFullmaktmottaker: false,
}

const forbiddenMock = {
  timestamp: '2024-09-09T13:26:24.519032',
  status: 403,
  error: 'FORBIDDEN',
  message: 'LOGIN_LEVEL_TOO_LOW',
  path: '/api/initiate',
}

const uforeMockUtenDatoer = {
  pid: '81549300',
  loggetInnSom: '81549300',
  saker: [
    {
      type: 'UFORETRYGD',
      status: 'LOPENDE',
    },
  ],
  hasIverksattVedtak: true,
  uforevedtak: {
    uforegrad: 100,
    virkFom: undefined,
    uforetidspunkt: undefined,
    inntektsgrense: 49611,
    sumAvForventedeInntekter: 150000,
    hasBarnetilleggFellesBarn: false,
    hasBarnetilleggSaerkullsbarn: false,
    hasGjenlevendeTillegg: false,
    hasVarigTilrettelagtArbeid: false,
  },
  innloggingstype: 'LEVEL4',
  harGammelFullmaktmottaker: false,
}

app.get('/api/initiate', (req, res) => {
  res.status(200).json(uforeMock)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
