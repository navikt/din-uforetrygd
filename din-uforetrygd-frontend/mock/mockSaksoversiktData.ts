import { BehandlingType, Status } from '../src/sections/ForsideBehandling/forsideBehandlingUtil'
import { SaksoversiktResponse } from '../src/api/hentSaksoversikt'

export const mockSaksoversiktData: Record<string, SaksoversiktResponse> = {
  default: {
    aktiveBehandlinger: [
      {
        type: BehandlingType.SØKNAD_UFØRETRYGD,
        status: Status.MOTTATT,
        mottattDato: '2024-10-01',
        ferdigstiltDato: undefined,
        etteroppgjor: undefined,
        avslattForutgaendeMedlemskap: false,
        beregning: null,
      },
    ],
    avsluttedeBehandlinger: [
      {
        type: BehandlingType.ETTEROPPGJØR,
        status: Status.INNVILGET,
        mottattDato: '2024-10-01',
        ferdigstiltDato: '2024-10-01',
        etteroppgjor: {
          type: 'TILBAKEKR',
          arstall: 2024,
          avviksbelop: 10000,
        },
        avslattForutgaendeMedlemskap: false,
        beregning: null,
      },
      {
        type: BehandlingType.REGULERING,
        status: Status.MOTTATT,
        mottattDato: '2024-10-01',
        ferdigstiltDato: '2024-10-01',
        etteroppgjor: undefined,
        avslattForutgaendeMedlemskap: false,
        beregning: null,
      },
    ],
  },
  'ingen-aktiv-behandling': {
    aktiveBehandlinger: [],
    avsluttedeBehandlinger: [
      {
        type: BehandlingType.REGULERING,
        status: Status.MOTTATT,
        mottattDato: '2024-10-01',
        ferdigstiltDato: '2024-10-01',
        etteroppgjor: undefined,
        avslattForutgaendeMedlemskap: false,
        beregning: null,
      },
    ],
  },
}
