import { BehandlingType, Status } from '@/sections/ForsideBehandling/forsideBehandlingUtil'
import type { UforetrygdResponse } from '@/api/initiate'
import { Innloggingstype } from '@/const'

export const mockData: Record<string, UforetrygdResponse> = {
  default: {
    pid: '81549300',
    sak: {
      status: 'LOPENDE',
      sakId: 519023581092,
    },
    hasIverksattVedtak: true,
    uforegrad: 100,
    innloggingstype: Innloggingstype.LEVEL3,
    behandling: {
      type: BehandlingType.SØKNAD_UFØRETRYGD,
      status: Status.INNVILGET,
      beregning: { nettoUforetrygdPerManed: 123456 },
      mottattDato: '2025-12-14',
      avslattForutgaendeMedlemskap: true,
    },
  },
  avsluttet: {
    pid: '81549300',
    sak: { status: 'AVSLUTTET' },
    hasIverksattVedtak: false,
    uforegrad: 100,
    innloggingstype: Innloggingstype.LEVEL4,
  },
  gradert: {
    pid: '81549300',
    sak: { status: 'LOPENDE' },
    hasIverksattVedtak: true,
    uforegrad: 50,
    innloggingstype: Innloggingstype.LEVEL4,
  },
  'har-lopende': {
    pid: '81549300',
    sak: { status: 'LOPENDE' },
    hasIverksattVedtak: false,
    uforegrad: undefined,
    innloggingstype: Innloggingstype.LEVEL4,
  },
  'sak-behandling': {
    pid: '81549300',
    sak: { status: 'TIL_BEHANDLING' },
    hasIverksattVedtak: false,
    uforegrad: undefined,
    behandling: {
      type: BehandlingType.SØKNAD_UFØRETRYGD,
      status: Status.MOTTATT,
      mottattDato: '2025-12-14',
      avslattForutgaendeMedlemskap: false,
      beregning: null,
    },
    innloggingstype: Innloggingstype.LEVEL4,
  },
  'ufore-behandling': {
    pid: '81549300',
    sak: { status: 'TIL_BEHANDLING' },
    hasIverksattVedtak: true,
    uforegrad: 100,
    behandling: {
      type: BehandlingType.SØKNAD_UFØRETRYGD,
      status: Status.MOTTATT,
      mottattDato: '2025-12-14',
      avslattForutgaendeMedlemskap: false,
      beregning: null,
    },
    innloggingstype: Innloggingstype.LEVEL4,
  },
  'ingen-uforesak': {
    pid: '81549300',
    sak: undefined,
    hasIverksattVedtak: false,
    uforegrad: undefined,
    innloggingstype: Innloggingstype.LEVEL4,
  },
  'ufore-uten-datoer': {
    pid: '81549300',
    sak: { status: 'LOPENDE' },
    hasIverksattVedtak: true,
    uforegrad: 100,
    innloggingstype: Innloggingstype.LEVEL4,
  },
  barnetillegg: {
    pid: '81549300',
    sak: {
      status: 'LOPENDE',
      sakId: 519023581092,
    },
    hasIverksattVedtak: true,
    uforegrad: 100,
    innloggingstype: Innloggingstype.LEVEL3,
    behandling: {
      type: BehandlingType.SØKNAD_BARNETILLEGG,
      status: Status.INNVILGET,
      beregning: { nettoUforetrygdPerManed: 123456, nettoBarnetilleggPerManed: 1234 },
      mottattDato: '2025-12-14',
      avslattForutgaendeMedlemskap: true,
    },
  },
  forbidden: {
    pid: undefined,
    sak: undefined,
    hasIverksattVedtak: false,
    innloggingstype: Innloggingstype.LEVEL3,
  },
}
