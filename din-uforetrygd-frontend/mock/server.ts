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
      grad: 100,
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
  tilgangstype: 'PERSONLIG',
  innloggingstype: 'LEVEL4',
  harGammelFullmaktmottaker: false,
}

const gradertUforeMock = {
  pid: '81549300',
  loggetInnSom: '81549300',
  saker: [
    {
      type: 'UFORETRYGD',
      grad: 50,
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
  tilgangstype: 'PERSONLIG',
  innloggingstype: 'LEVEL4',
  harGammelFullmaktmottaker: false,
}

const ingenUforesakMock = {
  pid: '81549300',
  loggetInnSom: '81549300',
  saker: [],
  hasIverksattVedtak: false,
  uforevedtak: null,
  tilgangstype: 'PERSONLIG',
  innloggingstype: 'LEVEL4',
  harGammelFullmaktmottaker: false,
}

app.get('/api/initiate', (req, res) => {
  res.json(ingenUforesakMock)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
