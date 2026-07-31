import { describe, expect, it } from 'vitest'
import type { Sak, UforetrygdResponse } from '@/api/initiate'
import { Visningskriterier } from '@/const'
import { getVisningskriterier } from '@/utils/getVisningskriterier/getVisningskriterier'

const defaultUforeResponse: UforetrygdResponse = {
  pid: '81549300',
  innloggingstype: 'LEVEL4',
  sak: undefined,
  hasIverksattVedtak: false,
  uforegrad: undefined,
  erVerge: false,
}

const uforesak: Sak = {
  status: 'LOPENDE',
}

const uforeResponse: UforetrygdResponse = {
  ...defaultUforeResponse,
  sak: uforesak,
  hasIverksattVedtak: true,
  uforegrad: 100,
}

const uforeOgSakTilBehanndling: UforetrygdResponse = {
  ...defaultUforeResponse,
  sak: { ...uforesak, status: 'TIL_BEHANDLING' },
  hasIverksattVedtak: true,
  uforegrad: undefined,
}

const gradertUfoereResponse: UforetrygdResponse = {
  ...defaultUforeResponse,
  sak: { ...uforesak },
  hasIverksattVedtak: true,
  uforegrad: 50,
}

const sakTilbehandlingAndIngenVedtak: UforetrygdResponse = {
  ...defaultUforeResponse,
  sak: { ...uforesak, status: 'TIL_BEHANDLING' },
  hasIverksattVedtak: false,
  uforegrad: undefined,
}

const ingenUforesakResponse: UforetrygdResponse = {
  ...defaultUforeResponse,
  hasIverksattVedtak: false,
  uforegrad: undefined,
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
