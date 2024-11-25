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

const dittUforevedtakData = {
  hasIverksattVedtak: true,
  dittUforevedtak: {
    uforegrad: 0,
    virkFom: '2024-12-01',
    uforetidspunkt: '2020-10-01',
    inntektsgrense: 49611,
    sumAvForventedeInntekter: 0,
    hasBarnetilleggFellesBarn: false,
    hasBarnetilleggSaerkullsbarn: false,
    hasGjenlevendeTillegg: false,
    hasVarigTilrettelagtArbeid: false,
  },
}

const uforeMock = {
  pid: '81549300',
  tilgangstype: 'PERSONLIG',
  innloggingstype: 'LEVEL3',
  harGammelFullmaktmottaker: false,
  saker: [{ type: 'UFORETRYGD', grad: 50, status: 'LOPENDE' }],
}

const gradertUfoereMock = {
  pid: '81549300',
  tilgangstype: 'PERSONLIG',
  innloggingstype: 'LEVEL3',
  harGammelFullmaktmottaker: false,
  saker: [{ type: 'UFORETRYGD', grad: 50, status: 'LOPENDE' }],
}

const ingenUforesakMock = {
  pid: '81549300',
  tilgangstype: 'PERSONLIG',
  innloggingstype: 'LEVEL3',
  harGammelFullmaktmottaker: false,
  saker: [{ type: 'ALDERSPENSJON', grad: 50, status: 'LOPENDE' }],
}

app.get('/api/initiate', (req, res) => {
  res.json(gradertUfoereMock)
})

app.get('/api/ditt-uforevedtak', (req, res) => {
  res.json(dittUforevedtakData)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
