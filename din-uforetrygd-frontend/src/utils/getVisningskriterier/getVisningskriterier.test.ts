import { describe, expect, it } from 'vitest'
import { Innloggingstype, type Sak, type UforetrygdResponse } from '@/api/initiate'
import { Visningskriterier } from '@/const'
import { getVisningskriterier } from '@/utils/getVisningskriterier/getVisningskriterier'

const defaultUforeResponse: UforetrygdResponse = {
  pid: '81549300',
  innloggingstype: Innloggingstype.LEVEL4,
  sak: null,
  hasIverksattVedtak: false,
  uforegrad: null,
  behandling: null,
}

const uforesak: Sak = {
  status: 'LOPENDE',
  sakId: '123456789',
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
  uforegrad: null,
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
  uforegrad: null,
}

const ingenUforesakResponse: UforetrygdResponse = {
  ...defaultUforeResponse,
  hasIverksattVedtak: false,
  uforegrad: null,
  sak: null,
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
