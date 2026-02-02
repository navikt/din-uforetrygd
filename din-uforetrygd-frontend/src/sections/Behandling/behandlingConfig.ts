export enum Status {
  MOTTATT = 'MOTTATT',
  INNVILGET = 'INNVILGET',
  AVSLAG = 'AVSLAG',
}

export enum BehandlingType {
  SØKNAD_UFØRETRYGD = 'SØKNAD_UFØRETRYGD',
  SØKNAD_ENDRING_UFØREGRAD = 'SØKNAD_ENDRING_UFØREGRAD',
  SØKNAD_BARNETILLEGG = 'SØKNAD_BARNETILLEGG',
  SØKNAD_UNG_UFØR = 'SØKNAD_UNG_UFØR',
  SØKNAD_YRKESSKADE = 'SØKNAD_YRKESSKADE',
}

export interface Lenke {
  href: string
  visningstekst: string
}

export type BehandlingData = {
  tittel: string
  statusTekst: string
  beskrivelse: string
  lenker: Lenke[]
}

export type BehandlingConfig = {
  [key in BehandlingType]: {
    [key in Status]: BehandlingData
  }
}

export const BEHANDLING_CONFIG: BehandlingConfig = {
  [BehandlingType.SØKNAD_UFØRETRYGD]: {
    [Status.MOTTATT]: {
      tittel: 'Søknaden om uføretrygd er mottatt',
      statusTekst: 'Søknad mottatt',
      beskrivelse: 'Søknaden din venter på behandling.',
      lenker: [
        {
          href: 'http://nav.no/saksbehandlingstider#uforetrygd',
          visningstekst: 'Les mer om saksbehandlingstid (åpnes i ny fane).',
        },
      ],
    },
    [Status.INNVILGET]: {
      tittel: 'Søknaden om uføretrygd er innvilget',
      statusTekst: 'Søknad innvilget',
      beskrivelse: 'Søknaden din er innvilget. Se beregning og viktig informasjon nedenfor.',
      lenker: [
        {
          href: 'https://www.nav.no/uforetrygd#etteroppgjor',
          visningstekst: 'Slik kan etteroppgjøret påvirke deg (åpnes i ny fane)',
        },
        {
          href: 'https://www.nav.no/uforetrygd#inntektsplanlegger',
          visningstekst: 'Hvordan bruke Inntektsplanlegger (åpnes i ny fane)',
        },
        {
          href: 'https://www.nav.no/uforetrygd#jobb',
          visningstekst: 'Du kan jobbe ved siden av uføretrygd (åpnes i ny fane)',
        },
        {
          href: 'todo',
          visningstekst: 'Se mer i vedtaksbrev i dokumentoversikten (åpnes i ny fane)',
        },
      ],
    },
    [Status.AVSLAG]: {
      tittel: 'Søknaden om uføretrygd er avslått',
      statusTekst: 'Søknad avslått',
      beskrivelse:
        'I vedtaksbrevet ditt kan du lese hvorfor. Har du spørsmål kan du kontakte oss. I vedtaksbrevet ditt finner du informasjon om hvordan du kan klage.',
      lenker: [
        {
          href: 'https://klage.nav.no/nb/klage/UFORETRYGD',
          visningstekst: 'Klag på vedtaket her (åpnes i ny fane)',
        },
        {
          href: 'https://www.nav.no/kontaktoss',
          visningstekst: 'Kontakt oss (åpnes i ny fane)',
        },
      ],
    },
  },

  [BehandlingType.SØKNAD_BARNETILLEGG]: {
    [Status.MOTTATT]: {
      tittel: 'Søknaden om barnetillegg er mottatt',
      statusTekst: 'Søknad mottatt',
      beskrivelse: 'Søknaden din venter på behandling.',
      lenker: [
        {
          href: 'http://nav.no/saksbehandlingstider#uforetrygd',
          visningstekst: 'Les mer om saksbehandlingstid (åpnes i ny fane).',
        },
        {
          href: 'https://www.nav.no/fyllut/nav121501',
          visningstekst: 'Viktig informasjon om inntekt og barnetillegg (åpnes i ny fane).',
        },
      ],
    },
    [Status.INNVILGET]: {
      tittel: 'Søknaden om barnetillegg er innvilget',
      statusTekst: 'Søknad innvilget',
      beskrivelse: 'Søknaden din er innvilget. Se beregning og viktig informasjon nedenfor.',
      lenker: [
        {
          href: 'todo',
          visningstekst: 'Se mer i vedtaksbrev i dokumentoversikten (åpnes i ny fane)',
        },
      ],
    },
    [Status.AVSLAG]: {
      tittel: 'Søknaden om barnetillegg er avslått',
      statusTekst: 'Søknad avslått',
      beskrivelse:
        'I vedtaksbrevet ditt kan du lese hvorfor. Har du spørsmål kan du kontakte oss. I vedtaksbrevet ditt finner du informasjon om hvordan du kan klage.',
      lenker: [
        {
          href: 'https://klage.nav.no/nb/klage/UFORETRYGD',
          visningstekst: 'Klag på vedtaket her (åpnes i ny fane)',
        },
        {
          href: 'https://www.nav.no/kontaktoss',
          visningstekst: 'Kontakt oss (åpnes i ny fane)',
        },
      ],
    },
  },

  [BehandlingType.SØKNAD_UNG_UFØR]: {
    [Status.MOTTATT]: {
      tittel: 'Søknaden om ung ufør er mottatt',
      statusTekst: 'Søknad mottatt',
      beskrivelse: 'Søknaden din venter på behandling.',
      lenker: [
        {
          href: 'http://nav.no/saksbehandlingstider#uforetrygd',
          visningstekst: 'Les mer om saksbehandlingstid (åpnes i ny fane).',
        },
      ],
    },
    [Status.INNVILGET]: {
      tittel: 'Søknaden om ung ufør er innvilget',
      statusTekst: 'Søknad innvilget',
      beskrivelse: 'Søknaden din er innvilget. Se beregning og viktig informasjon nedenfor.',
      lenker: [
        {
          href: 'https://www.nav.no/uforetrygd#etteroppgjor',
          visningstekst: 'Slik kan etteroppgjøret påvirke deg (åpnes i ny fane)',
        },
        {
          href: 'https://www.nav.no/uforetrygd#inntektsplanlegger',
          visningstekst: 'Hvordan bruke Inntektsplanlegger (åpnes i ny fane)',
        },
        {
          href: 'https://www.nav.no/uforetrygd#jobb',
          visningstekst: 'Du kan jobbe ved siden av uføretrygd (åpnes i ny fane)',
        },
        {
          href: 'todo',
          visningstekst: 'Se mer i vedtaksbrev i dokumentoversikten (åpnes i ny fane)',
        },
      ],
    },
    [Status.AVSLAG]: {
      tittel: 'Søknaden om ung ufør er avslått',
      statusTekst: 'Søknad avslått',
      beskrivelse:
        'I vedtaksbrevet ditt kan du lese hvorfor. Har du spørsmål kan du kontakte oss. I vedtaksbrevet ditt finner du informasjon om hvordan du kan klage.',
      lenker: [
        {
          href: 'https://klage.nav.no/nb/klage/UFORETRYGD',
          visningstekst: 'Klag på vedtaket her (åpnes i ny fane)',
        },
        {
          href: 'https://www.nav.no/kontaktoss',
          visningstekst: 'Kontakt oss (åpnes i ny fane)',
        },
      ],
    },
  },

  [BehandlingType.SØKNAD_ENDRING_UFØREGRAD]: {
    [Status.MOTTATT]: {
      tittel: 'Søknaden om endring av uføregrad er mottatt',
      statusTekst: 'Søknad mottatt',
      beskrivelse: 'Søknaden din venter på behandling.',
      lenker: [
        {
          href: 'http://nav.no/saksbehandlingstider#uforetrygd',
          visningstekst: 'Les mer om saksbehandlingstid (åpnes i ny fane).',
        },
      ],
    },
    [Status.INNVILGET]: {
      tittel: 'Søknaden om endring av uføregrad er innvilget',
      statusTekst: 'Søknad innvilget',
      beskrivelse: 'Søknaden din er innvilget. Din uføregrad er endret. Se beregning og viktig informasjon nedenfor.',
      lenker: [
        {
          href: 'https://www.nav.no/uforetrygd#etteroppgjor',
          visningstekst: 'Slik kan etteroppgjøret påvirke deg (åpnes i ny fane)',
        },
        {
          href: 'https://www.nav.no/uforetrygd#inntektsplanlegger',
          visningstekst: 'Hvordan bruke Inntektsplanlegger (åpnes i ny fane)',
        },
        {
          href: 'todo',
          visningstekst: 'Se mer i vedtaksbrev i dokumentoversikten (åpnes i ny fane)',
        },
      ],
    },
    [Status.AVSLAG]: {
      tittel: 'Søknaden om endring av uføregrad er avslått',
      statusTekst: 'Søknad avslått',
      beskrivelse:
        'I vedtaksbrevet ditt kan du lese hvorfor. Har du spørsmål kan du kontakte oss. I vedtaksbrevet ditt finner du informasjon om hvordan du kan klage.',
      lenker: [
        {
          href: 'https://klage.nav.no/nb/klage/UFORETRYGD',
          visningstekst: 'Klag på vedtaket her (åpnes i ny fane)',
        },
        {
          href: 'https://www.nav.no/kontaktoss',
          visningstekst: 'Kontakt oss (åpnes i ny fane)',
        },
      ],
    },
  },

  [BehandlingType.SØKNAD_YRKESSKADE]: {
    [Status.MOTTATT]: {
      tittel: 'Søknaden om yrkesskade er mottatt',
      statusTekst: 'Søknad mottatt',
      beskrivelse: 'Søknaden din venter på behandling.',
      lenker: [
        {
          href: 'http://nav.no/saksbehandlingstider#uforetrygd',
          visningstekst: 'Les mer om saksbehandlingstid (åpnes i ny fane).',
        },
      ],
    },
    [Status.INNVILGET]: {
      tittel: 'Søknaden om yrkesskade er innvilget',
      statusTekst: 'Søknad innvilget',
      beskrivelse: 'Søknaden din er innvilget. Se beregning og viktig informasjon nedenfor.',
      lenker: [
        {
          href: 'todo',
          visningstekst: 'Se mer i vedtaksbrev i dokumentoversikten (åpnes i ny fane)',
        },
      ],
    },
    [Status.AVSLAG]: {
      tittel: 'Søknaden om yrkesskade er avslått',
      statusTekst: 'Søknad avslått',
      beskrivelse:
        'I vedtaksbrevet ditt kan du lese hvorfor. Har du spørsmål kan du kontakte oss. I vedtaksbrevet ditt finner du informasjon om hvordan du kan klage.',
      lenker: [
        {
          href: 'https://klage.nav.no/nb/klage/UFORETRYGD',
          visningstekst: 'Klag på vedtaket her (åpnes i ny fane)',
        },
        {
          href: 'https://www.nav.no/kontaktoss',
          visningstekst: 'Kontakt oss (åpnes i ny fane)',
        },
      ],
    },
  },
}
