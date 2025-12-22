import { components } from '../src/api/api'

export const mockSaksoversiktData: Record<string, components['schemas']['SaksoversiktResponse']> = {
  default: {
    aktivBehandling: {
      visningstittel: 'Søknad om uføretrygd',
      status: 'TIL_BEHANDLING',
      mottattDato: '2024-10-01',
      ferdigstiltDato: undefined,
    },
    avsluttedeBehandlinger: [
      {
        visningstittel: 'Revurdering av uføretrygd',
        status: 'TIL_BEHANDLING',
        mottattDato: '2023-05-15',
        ferdigstiltDato: '2023-06-20',
      },
      {
        visningstittel: 'Etteroppgjør',
        status: 'TIL_BEHANDLING',
        mottattDato: '2024-05-15',
        ferdigstiltDato: '2024-06-20',
      },
    ],
  },
  'ingen-aktiv-behandling': {
    aktivBehandling: undefined,
    avsluttedeBehandlinger: [
      {
        visningstittel: 'Søknad om uføretrygd',
        status: 'TIL_BEHANDLING',
        mottattDato: '2023-01-01',
        ferdigstiltDato: '2023-02-15',
      },
    ],
  },
}
