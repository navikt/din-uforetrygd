import { components } from '../src/api/api'

export const mockSaksoversiktData: Record<string, components['schemas']['SaksoversiktResponse']> = {
  default: {
    aktiveBehandlinger: [
      {
        tittel: 'Søknad om uføretrygd',
        mottattDato: '2024-10-01',
        ferdigstiltDato: undefined,
        avslag: false,
        etteroppgjor: undefined,
        steg: [
          {
            aktiv: true,
            utfort: false,
            tittel: 'Søknad mottatt',
          },
          {
            aktiv: false,
            utfort: false,
            tittel: 'Søknad innvilget',
            undertekst: 'Det er bra',
          },
        ],
        vedtakId: 123,
        avslattForutgaendeMedlemskap: false,
      },
    ],
    avsluttedeBehandlinger: [
      {
        tittel: 'Søknad om uføretrygd',
        mottattDato: '2024-05-15',
        ferdigstiltDato: '2024-06-20',
        avslag: false,
        etteroppgjor: undefined,
        steg: [
          {
            aktiv: false,
            utfort: true,
            tittel: 'Søknad mottatt',
          },
          {
            aktiv: false,
            utfort: true,
            tittel: 'Søknaden er avslått',
            undertekst: 'Les brevet ditt',
          },
        ],
        vedtakId: 1234,
        avslattForutgaendeMedlemskap: true,
      },
      {
        tittel: 'Revurdering av uføretrygd',
        mottattDato: '2023-05-15',
        ferdigstiltDato: '2023-06-20',
        avslag: false,
        etteroppgjor: undefined,
        steg: [
          {
            aktiv: false,
            utfort: true,
            tittel: 'Søknad mottatt',
          },
          {
            aktiv: true,
            utfort: false,
            tittel: 'Søknad innvilget',
            undertekst: 'Det er bra',
          },
        ],
        vedtakId: 123,
        avslattForutgaendeMedlemskap: false,
      },
      {
        tittel: 'Etteroppgjør',
        mottattDato: '2024-05-15',
        ferdigstiltDato: '2024-06-20',
        avslag: false,
        etteroppgjor: undefined,
        steg: [
          {
            aktiv: false,
            utfort: true,
            tittel: 'Søknad mottatt',
          },
          {
            aktiv: false,
            utfort: true,
            tittel: 'Søknad innvilget',
            undertekst: 'Det er bra',
          },
        ],
        vedtakId: 1234,
        avslattForutgaendeMedlemskap: false,
      },
    ],
  },
  'ingen-aktiv-behandling': {
    aktiveBehandlinger: [],
    avsluttedeBehandlinger: [
      {
        tittel: 'Søknad om uføretrygd',
        mottattDato: '2023-01-01',
        ferdigstiltDato: '2023-02-15',
        avslag: false,
        etteroppgjor: undefined,
        steg: [
          {
            aktiv: false,
            utfort: true,
            tittel: 'Søknad mottatt',
          },
          {
            aktiv: false,
            utfort: true,
            tittel: 'Søknad innvilget',
            undertekst: 'Det er bra',
          },
        ],
        vedtakId: 1234,
        avslattForutgaendeMedlemskap: false,
      },
    ],
  },
}
