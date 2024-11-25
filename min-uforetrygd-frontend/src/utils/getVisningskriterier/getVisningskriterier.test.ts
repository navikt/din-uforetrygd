import { describe, expect, it } from 'vitest'
import { getVisningskriterier } from '@/utils/getVisningskriterier/index'
import { components } from '@/api/api'
import { Visningskriterier } from '@/const'

const defaultUforeResponse: components['schemas']['UforetrygdResponse'] = {
  pid: '81549300',
  loggetInnSom: '81549300',
  tilgangstype: 'PERSONLIG',
  innloggingstype: 'LEVEL4',
  harGammelFullmaktmottaker: false,
  saker: [],
  hasIverksattVedtak: false,
  uforevedtak: undefined,
}

const uforevedtak: components['schemas']['DittUforevedtak'] = {
  uforegrad: 100,
  virkFom: '2024-12-01',
  uforetidspunkt: '2020-10-01',
  inntektsgrense: 49611,
  sumAvForventedeInntekter: 150000,
  hasBarnetilleggFellesBarn: false,
  hasBarnetilleggSaerkullsbarn: false,
  hasGjenlevendeTillegg: false,
  hasVarigTilrettelagtArbeid: false,
}

const uforesak: components['schemas']['Sak'] = {
  type: 'UFORETRYGD',
  grad: 100,
  status: 'LOPENDE',
}

const uforeResponse: components['schemas']['UforetrygdResponse'] = {
  ...defaultUforeResponse,
  saker: [uforesak],
  hasIverksattVedtak: true,
  uforevedtak: uforevedtak,
}

const uforeOgSakTilBehanndling: components['schemas']['UforetrygdResponse'] = {
  ...defaultUforeResponse,
  saker: [{ ...uforesak, status: 'TIL_BEHANDLING' }],
  hasIverksattVedtak: true,
  uforevedtak: uforevedtak,
}

const gradertUfoereResponse: components['schemas']['UforetrygdResponse'] = {
  ...defaultUforeResponse,
  saker: [{ ...uforesak, grad: 50 }],
  hasIverksattVedtak: true,
  uforevedtak: { ...uforevedtak, uforegrad: 50 },
}

const sakTilbehandlingAndIngenVedtak: components['schemas']['UforetrygdResponse'] = {
  ...defaultUforeResponse,
  saker: [{ ...uforesak, status: 'TIL_BEHANDLING' }],
  hasIverksattVedtak: false,
  uforevedtak: undefined,
}

const ingenUforesakResponse: components['schemas']['UforetrygdResponse'] = {
  ...defaultUforeResponse,
  hasIverksattVedtak: false,
  uforevedtak: undefined,
  saker: [{ type: 'ALDERSPENSJON', grad: 50, status: 'LOPENDE' }],
}

describe('getVisningskriterier', () => {
  it('should show visningskriterier for ufore', () => {
    const actual = getVisningskriterier(uforeResponse)
    expect(actual).toEqual([Visningskriterier.Uforetrygd])
  })
  it('should show visningskriterier for gradert ufore', () => {
    const actual = getVisningskriterier(gradertUfoereResponse)
    expect(actual).toEqual([Visningskriterier.GradertUfore, Visningskriterier.Uforetrygd])
  })
  it('should show visningskriterier for ufore and sak til behandling', () => {
    const actual = getVisningskriterier(uforeOgSakTilBehanndling)
    expect(actual).toEqual([Visningskriterier.Uforetrygd, Visningskriterier.SakTilBehandling])
  })
  it('should show visningskriterier for ingen iverksatt vedtak and sak til behandling', () => {
    const actual = getVisningskriterier(sakTilbehandlingAndIngenVedtak)
    expect(actual).toEqual([Visningskriterier.SakTilBehandling])
  })
  it('should show visningskriterier for ingen ufore', () => {
    const actual = getVisningskriterier(ingenUforesakResponse)
    expect(actual).toEqual([Visningskriterier.IngenUforesak])
  })
})
