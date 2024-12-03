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

app.get('/api/initiate', (req, res) => {
  res.status(200).json(uforeMock)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
