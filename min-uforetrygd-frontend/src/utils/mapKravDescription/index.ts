export const mapKravDescription = (kravGjelder: string, kravArsak: string, sakstype: string): string => {
  const descriptions: Record<string, Record<string, string> | string> = {
    AFP_EO: {
      OMGJ_ETTER_ANKE: 'AFP etteroppgjør omgjøring etter anke',
      OMGJ_ETTER_KLAGE: 'AFP etteroppgjør omgjøring etter klage',
      default: 'AFP etteroppgjør',
    },
    ANKE: {
      BARNETILLEGG: 'Anke av barnetillegg',
      EKSPORT: 'Anke av eksport',
      EKTEFELLETILLEGG: 'Anke av ektefelletillegg',
      GJENLEVENDERETT: 'Anke av gjenlevenderett',
      GRADSENDRINGER: 'Anke av gradsendringer',
      MEDL_TRYGDETID: 'Anke av medlemskap/trygdetid', // vurder
      OPPHOR_REDUKSJON: 'Anke av opphør/reduksjon', // vurder
      OPPTJENINGSGRUNNLAG: 'Anke av opptjeningsgrunnlag',
      TIDLIGUTTAK: 'Anke av tidliguttak',
      TILBAKEKREVING: 'Anke av tilbakekreving',
      VIRK_TIDSPUNKT: 'Anke av virkningstidspunkt',
      YRKESSKADE: 'Anke av yrkesskade',
      default: 'Anke',
    },
    EKSPORT: 'Eksport av ' + sakstype,
    ENDR_UTTAKSGRAD: 'Endring av uttaksgrad', // mulig å få med grad her?
    ETTERGIV_GJELD: {
      OMGJ_ETTER_ANKE: 'Ettergivelse av gjeld grunnet omgjøring etter anke',
      OMGJ_ETTER_KLAGE: 'Ettergivelse av gjeld grunnet omgjøring etter klage',
      default: 'Ettergivelse av gjeld',
    },
    FORSTEG_BH: {
      NY_SOKNAD: 'Søknad om ' + sakstype + ' - ny søknad',
      OMGJ_ETTER_ANKE: 'Søknad om ' + sakstype + ' - omgjøring etter anke',
      OMGJ_ETTER_KLAGE: 'Søknad om ' + sakstype + ' - omgjøring etter klage',
      REKONSTRUKSJON: 'Søknad om ' + sakstype + ' - rekonstruksjon',
    },
    F_BH_BO_UTL: {
      NY_SOKNAD: 'Søknad om ' + sakstype + ' - ny søknad',
      OMGJ_ETTER_ANKE: 'Søknad om ' + sakstype + ' - omgjøring etter anke',
      OMGJ_ETTER_KLAGE: 'Søknad om ' + sakstype + ' - omgjøring etter klage',
      REKONSTRUKSJON: 'Søknad om ' + sakstype + ' - rekonstruksjon',
    },
    F_BH_KUN_UTL: {
      NY_SOKNAD: 'Søknad om ' + sakstype + ' - ny søknad',
      OMGJ_ETTER_ANKE: 'Søknad om ' + sakstype + ' - omgjøring etter anke',
      OMGJ_ETTER_KLAGE: 'Søknad om ' + sakstype + ' - omgjøring etter klage',
      REKONSTRUKSJON: 'Søknad om ' + sakstype + ' - rekonstruksjon',
    },
    F_BH_MED_UTL: {
      NY_SOKNAD: 'Søknad om ' + sakstype + ' - ny søknad',
      OMGJ_ETTER_ANKE: 'Søknad om ' + sakstype + ' - omgjøring etter anke',
      OMGJ_ETTER_KLAGE: 'Søknad om ' + sakstype + ' - omgjøring etter klage',
      REKONSTRUKSJON: 'Søknad om ' + sakstype + ' - rekonstruksjon',
    },
    GOD_OMSGSP: {
      OMGJ_ETTER_ANKE: 'Godskriving omsorgsopptjening omgjort etter anke',
      OMGJ_ETTER_KLAGE: 'Godskriving omsorgsopptjening omgjort etter klage',
      default: 'Godskriving omsorgsopptjening',
    },
    INNT_E: {
      ANNEN_FOR_END_IN: 'Inntektsendring - annen forelder har endret inntekt',
      ANNEN_ARSAK_END_IN: 'Inntektsendring - annen årsak til inntektsendring',
      BEGGE_FOR_END_IN: 'Inntektsendring - begge forsørgerne har endret inntekt',
      BARN_ENDRET_INNTEKT: 'Inntektsendring - inntekt til barn er endret',
      ENDRET_INNTEKT: 'Inntektsendring - inntekt til bruker er endret',
      OMGJ_ETTER_ANKE: 'Inntektsendring - omgjøring etter anke',
      OMGJ_ETTER_KLAGE: 'Inntektsendring - omgjøring etter klage',
      default: 'Inntektsendring',
    },
    KLAGE: {
      AVSLAG_UT: 'Klage på avslag uføretrygd',
      AVSLAG_UNG_UFR: 'Klage på avslag ung ufør',
      BARNETILLEGG: 'Klage på barnetillegg',
      BEREGNING: 'Klage på beregning',
      EKSPORT: 'Klage på eksport',
      EKTEFELLETILLEGG: 'Klage på ektefelletillegg',
      ETTEROPPGJOR: 'Klage på etteroppgjør',
      GJENLEVENDERETT: 'Klage på gjenlevenderett',
      GJENLEVENDETILLEGG: 'Klage på gjenlevendetillegg',
      HVIL_STONADSRETT: 'Klage på hvilende stønadsrett',
      LOVVALG: 'Klage på lovvalg',
      MEDL_TRYGDETID: 'Klage på medlemskap/trygdetid',
      OPPHOR_RED_UFG: 'Klage på opphør/reduksjon uføregrad',
      TILBAKEKREVING: 'Klage på tilbakekreving',
      UFG_IFU_OG_IEU: 'Klage på uføregrad/IFU og IEU',
      UFR_TIDSPUNKT: 'Klage på uføretrygd tidspunkt',
      UTBET_AVKORT: 'Klage på utbetaling/avkortning',
      VIRK_TIDSPUNKT: 'Klage på virkningstidspunkt',
      YRK_SKADE_SYK: 'Klage på yrkesskade/-sykdom',
      GRADSENDRINGER: 'Klage på gradsendringer',
      OPPHOR_REDUKSJON: 'Klage på opphør/reduksjon',
      OPPTJENINGSGRUNNLAG: 'Klage på opptjeningsgrunnlag',
      TIDLIGUTTAK: 'Klage på tidliguttak',
      YRKESSKADE: 'Klage på yrkesskade',
      OMSORG_FOR_SMA_BARN: 'Klage på omsorg for små barn',
      OVRFR_OMSORGSPOENG: 'Klage på overføring av omsorgsopptjening',
      PLEIE_ELDR_SYK_FUNK: 'Klage på pleie eldre/syke/funksjonshemmede',
      default: 'Klage',
    },
    KONTROLL_3_17_A: 'Kontroll av vilkår for antatte fremtidige pensjonspoeng',
    // KONVERTERING: 'Konvertert krav',
    // KONVERTERING_MIN: 'Minimalt konvertert krav',
    // KONV_AVVIK_G_BATCH: 'Konvertering - Avvik ved G-omr',
    // MELLOMBH: 'Mellombehandling',
    // MTK: 'Merskatt tilbakekreving',
    OMGJ_TILBAKE: 'Omgjøring av tilbakekreving',
    OVERF_OMSGSP: {
      OMGJ_ETTER_ANKE: 'Overføring omsorgsopptjening omgjort etter anke',
      OMGJ_ETTER_KLAGE: 'Overføring omsorgsopptjening omgjort etter klage',
      default: 'Overføring omsorgsopptjening',
    },
    REGULERING: {
      OMGJ_ETTER_ANKE: 'Regulering omgjort etter anke',
      OMGJ_ETTER_KLAGE: 'Regulering omgjort etter klage',
      default: 'Regulering',
    },
    REVURD: {
      ALDERSOVERGANG: 'Saksgjennomgang grunnet aldersovergang',
      ANNEN_ARSAK: 'Saksgjennomgang grunnet annen årsak til saksbehandling', // ?? Skal denne egentlig med?
      ENDR_ANNEN_SAK: 'Saksgjennomgang grunnet bruker har annen sak som er endret',
      BARN_DOD: 'Saksgjennomgang grunnet dødsfall barn', // ?? Skal denne egentlig med?
      TILST_DOD: 'Saksgjennomgang grunnet dødsfall tilstøtende', // ?? Skal denne egentlig med?
      ENDRING_IFU: 'Saksgjennomgang grunnet endring av IFU', // Hva er IFU?
      VURDER_FORSORG: 'Saksgjennomgang grunnet forsørgingstillegg skal vurderes',
      GJNL_SKAL_VURD: 'Saksgjennomgang grunnet gjenlevendetilegg skal vurderes',
      BARN_ENDRET_INNTEKT: 'Saksgjennomgang grunnet inntekt til barn er endret',
      ENDRET_INNTEKT: 'Saksgjennomgang grunnet inntekt til bruker er endret',
      EPS_ENDRET_INNTEKT: 'Saksgjennomgang grunnet inntekt til tilstøtende er endret',
      INNVANDRET: 'Saksgjennomgang grunnet innvandring',
      INSTOPPHOLD: 'Saksgjennomgang grunnet institusjonsopphold på bruker/tilstøtende',
      OMGJ_ETTER_KLAGE: 'Saksgjennomgang grunnet omgjøring etter klage',
      OMGJ_ETTER_ANKE: 'Saksgjennomgang grunnet omgjøring etter anke',
      OMGJ_ETTER_FVL_P35_A: 'Saksgjennomgang grunnet omgjøring fvl. § 35 første ledd bokstav a',
      OMGJ_ETTER_FVL_P35_B: 'Saksgjennomgang grunnet omgjøring fvl. § 35 første ledd bokstav b',
      OMGJ_ETTER_FVL_P35_C: 'Saksgjennomgang grunnet omgjøring fvl. § 35 første ledd bokstav c',
      OMREGN_UFORETRYGD: 'Saksgjennomgang grunnet omregning til uføretrygd',
      OPPHOR: 'Saksgjennomgang grunnet opphør av brukers ytelse',
      TILSTOT_OPPHORT: 'Saksgjennomgang grunnet opphør av tilstøtendes ytelse',
      ENDRET_OPPTJENING: 'Saksgjennomgang grunnet opptjeningsgrunnlag er endret',
      REKONSTRUKSJON: 'Saksgjennomgang grunnet rekonstruksjon',
      SIVILSTANDSENDRING: 'Saksgjennomgang grunnet sivilstandsendring',
      SOKNAD_BT: 'Saksgjennomgang grunnet søknad om barnetillegg',
      EPS_NY_YTELSE: 'Saksgjennomgang grunnet tilstøtende har fått innvilget pensjon',
      EPS_NY_YTELSE_UT: 'Saksgjennomgang grunnet tilstøtende har fått innvilget uføretrygd',
      EPS_OPPH_YTELSE_UT: 'Saksgjennomgang grunnet tilstøtende sin uføretrygd er opphørt',
      TILSTOT_ENDR_YTELSE: 'Saksgjennomgang grunnet tilstøtende sin sak er endret',
      UFOREOVERGANG: 'Saksgjennomgang grunnet uføretrygdovergang',
      VURDER_SERSKILT_SATS: 'Saksgjennomgang grunnet særskilt sats for forsørger skal vurderes',
      default: 'Saksgjennomgang',
    },
    SAK_OMKOST: 'Behandling relatert til saksomkostninger',
    SLUTT_BH_UTL: 'Behandling av saken din i utlandet', // ??
    SOK_OKN_UG: 'Endring av uføregrad',
    SOK_RED_UG: 'Endring av uføregrad',
    SOK_UU: {
      OMGJ_ETTER_KLAGE: 'Søknad om ung ufør - omgjøring etter klage',
      OMGJ_ETTER_ANKE: 'Søknad om ung ufør - omgjøring etter anke',
      default: 'Søknad om ung ufør',
    },
    SOK_YS: {
      OMGJ_ETTER_KLAGE: 'Søknad yrkesskade ufør - omgjøring etter klage',
      OMGJ_ETTER_ANKE: 'Søknad yrkesskade ufør - omgjøring etter anke',
      default: 'Søknad om yrkesskade',
    },
    TILBAKEKR: {
      OMGJ_ETTER_KLAGE: 'Tilbakekreving grunnet omgjøring etter klage',
      OMGJ_ETTER_ANKE: 'Tilbakekreving grunnet omgjøring etter anke',
      default: 'Tilbakekreving',
    },
    UT_EO: {
      OMGJ_ETTER_KLAGE: 'Etteroppgjør uføretrygd - omgjort etter klage',
      OMGJ_ETTER_ANKE: 'Etteroppgjør uføretrygd - omgjort etter anke',
      default: 'Etteroppgjør uføretrygd',
    },
    // UT_VURDERING_EO: 'Vurdering av etteroppgjør',
    UTSEND_AVTALELAND: 'Sendt krav til avtaleland',
    SLUTTBEH_KUN_UTL: 'Behandling av saken din i utlandet', // ??
  }

  const kravMapping = descriptions[kravGjelder]
  if (typeof kravMapping === 'string') {
    return kravMapping
  }

  return kravMapping?.[kravArsak] || kravMapping?.default || ''
}
