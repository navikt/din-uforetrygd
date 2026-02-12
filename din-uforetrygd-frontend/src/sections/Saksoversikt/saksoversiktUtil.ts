import { StegType } from './saksoversiktType'

export function lagBehandlingTittel(
  kravGjelder: string,
  arsak: string | null,
  vedtakstype: string | null,
  etteroppgjorArstall?: number | null
): string {
  const reguleringTekst = 'Regulering i forbindelse med nytt grunnbeløp'

  if (vedtakstype === 'REGULERING') {
    return reguleringTekst
  }

  switch (kravGjelder) {
    case 'EKSPORT':
      return 'Eksport av uføretrygd til utlandet'
    case 'FORSTEG_BH':
    case 'F_BH_BO_UTL':
    case 'F_BH_MED_UTL':
      return 'Søknad om uføretrygd'
    case 'INNT_E':
      return 'Inntektsendring'
    case 'MELLOMBH':
      return 'Søknad om uføretrygd - opplysninger fra utlandet'
    case 'REGULERING':
      return reguleringTekst
    case 'SLUTT_BH_UTL':
      return 'Søknad om uføretrygd - endelig vedtak'
    case 'SOK_RED_UG':
      return 'Søknad om reduksjon av uføregrad'
    case 'SOK_OKN_UG':
      return 'Søknad om økning av uføregrad'
    case 'SOK_UU':
      return 'Søknad om ung ufør'
    case 'SOK_YS':
      return 'Søknad om yrkesskade'
    case 'UT_EO':
      return 'Etteroppgjør' + (etteroppgjorArstall ? ` for ${etteroppgjorArstall}` : '')
    case 'REVURD':
      switch (arsak) {
        case 'ENDRING_IFU':
          return 'Endring av inntekt før uførhet'
        case 'SOKNAD_BT':
          return 'Søknad om barnetillegg'
        default:
          return 'Revurdering'
      }
    default:
      return 'Behandling'
  }
}

export function lagSteg(
  kravGjelder: string,
  arsak: string | null,
  vedtakstype: string | null,
  mottattDato: string,
  ferdigstiltDato: string | null,
  avslag: boolean,
  aktivBehandling: boolean
): StegType[] {
  if (vedtakstype === 'REGULERING') {
    return [
      {
        tittel: 'Regulering er igangsatt',
        dato: mottattDato,
        undertekst: null,
      },
      {
        tittel: 'Regulering er ferdig behandlet',
        dato: ferdigstiltDato,
        undertekst: aktivBehandling ? null : avslag ? 'Søknaden er avslått' : 'Søknaden er innvilget',
      },
    ]
  }

  switch (kravGjelder) {
    case 'INNT_E':
      return [
        {
          tittel: 'Opplysninger om endret inntekt er mottatt og ligger i behandlingskø',
          dato: mottattDato,
          undertekst: null,
        },
        {
          tittel: 'Inntektsendring er ferdig behandlet',
          dato: ferdigstiltDato,
          undertekst: aktivBehandling ? null : avslag ? 'Søknaden er avslått' : 'Søknaden er innvilget',
        },
      ]

    case 'REGULERING':
      return [
        {
          tittel: 'Regulering av uføretrygden er igangsatt',
          dato: mottattDato,
          undertekst: null,
        },
        {
          tittel: 'Regulering av uføretrygden er ferdig behandlet',
          dato: ferdigstiltDato,
          undertekst: aktivBehandling ? null : avslag ? 'Søknaden er avslått' : 'Søknaden er innvilget',
        },
      ]

    case 'UT_EO':
      return [
        {
          tittel: 'Etteroppgjør er igangsatt',
          dato: mottattDato,
          undertekst: null,
        },
        {
          tittel: 'Etteroppgjør er ferdig behandlet',
          dato: ferdigstiltDato,
          undertekst: aktivBehandling ? null : avslag ? 'Søknaden er avslått' : 'Søknaden er innvilget',
        },
      ]

    case 'EKSPORT':
    case 'FORSTEG_BH':
    case 'F_BH_BO_UTL':
    case 'F_BH_MED_UTL':
    case 'SLUTT_BH_UTL':
    case 'SOK_RED_UG':
    case 'SOK_OKN_UG':
    case 'SOK_UU':
    case 'SOK_YS':
    case 'MELLOMBH':
      return lagDefaultSteg(mottattDato, ferdigstiltDato, avslag, aktivBehandling)

    case 'REVURD':
      if (arsak === 'ENDRING_IFU' || arsak === 'SOKNAD_BT') {
        return lagDefaultSteg(mottattDato, ferdigstiltDato, avslag, aktivBehandling)
      }
      return lagDefaultSteg(mottattDato, ferdigstiltDato, avslag, aktivBehandling)

    default:
      return lagDefaultSteg(mottattDato, ferdigstiltDato, avslag, aktivBehandling)
  }
}

function lagDefaultSteg(
  mottattDato: string,
  ferdigstiltDato: string | null,
  avslag: boolean,
  aktivBehandling: boolean
): StegType[] {
  return [
    {
      tittel: 'Søknad er mottatt og ligger i behandlingskø',
      dato: mottattDato,
      undertekst: null,
    },
    {
      tittel: 'Søknad er ferdig behandlet',
      dato: ferdigstiltDato,
      undertekst: aktivBehandling ? null : avslag ? 'Søknaden er avslått' : 'Søknaden er innvilget',
    },
  ]
}
