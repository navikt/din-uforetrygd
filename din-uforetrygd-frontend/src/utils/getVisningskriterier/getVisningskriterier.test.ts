import { describe, expect, it } from 'vitest'
import type { components } from '@/api/api'
import { Visningskriterier } from '@/const'
import { getVisningskriterier } from '@/utils/getVisningskriterier/getVisningskriterier'

const defaultUforeResponse: components['schemas']['UforetrygdResponse'] = {
  pid: '81549300',
  loggetInnSom: '81549300',
  innloggingstype: 'LEVEL4',
  harGammelFullmaktmottaker: false,
  sak: undefined,
  hasIverksattVedtak: false,
  uforevedtak: undefined,
  journalposter: [],
  verge: false,
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
  inntektFraSkatt: 1000,
  nettoUtbetalingMnd: 1200,
}

const uforesak: components['schemas']['Sak'] = {
  status: 'LOPENDE',
}

const uforeResponse: components['schemas']['UforetrygdResponse'] = {
  ...defaultUforeResponse,
  sak: uforesak,
  hasIverksattVedtak: true,
  uforevedtak: uforevedtak,
}

const uforeOgSakTilBehanndling: components['schemas']['UforetrygdResponse'] = {
  ...defaultUforeResponse,
  sak: { ...uforesak, status: 'TIL_BEHANDLING' },
  hasIverksattVedtak: true,
  uforevedtak: uforevedtak,
}

const gradertUfoereResponse: components['schemas']['UforetrygdResponse'] = {
  ...defaultUforeResponse,
  sak: { ...uforesak },
  hasIverksattVedtak: true,
  uforevedtak: { ...uforevedtak, uforegrad: 50 },
}

const sakTilbehandlingAndIngenVedtak: components['schemas']['UforetrygdResponse'] = {
  ...defaultUforeResponse,
  sak: { ...uforesak, status: 'TIL_BEHANDLING' },
  hasIverksattVedtak: false,
  uforevedtak: undefined,
}

const ingenUforesakResponse: components['schemas']['UforetrygdResponse'] = {
  ...defaultUforeResponse,
  hasIverksattVedtak: false,
  uforevedtak: undefined,
  sak: undefined,
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
