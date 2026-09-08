import { z } from 'zod'

const serverEnvSchema = z.object({
  MODE: z.enum(['borger', 'veileder']),
  DECORATOR_ENV: z.enum(['dev', 'prod']).default('prod'),
  DIN_UFORETRYGD_BACKEND: z.string(),
  UFORE_VARSLER: z.string(),
  DIN_UFORETRYGD_BACKEND_SCOPE: z.string(),
  UFORE_VARSLER_SCOPE: z.string(),
  FARO_URL: z.string(),
  NAIS_APP_NAME: z.string(),
  REPRESENTASJON_BANNER: z.string().optional(),

  LINK_SOKNAD_GRADERT_UFORE: z.string(),
  LINK_SOKNAD_UFORE: z.string(),
  LINK_SOKNAD_BARNETILLEGG: z.string(),
  LINK_LES_MER_OM_UFORETRYGD: z.string(),
  LINK_ENDRE_KONTONUMMER: z.string(),
  LINK_PERSONOPPLYSNINGER: z.string(),
  LINK_OKONOMISKE_TILLEGG: z.string(),
  LINK_KLAGE: z.string(),
  LINK_UTBETALINGER: z.string(),
  LINK_INNTEKTSPLANLEGGER: z.string(),
  LINK_SKATTETREKK: z.string(),
  LINK_FAMILIEFORHOLD: z.string(),
  LINK_FULLMAKTER: z.string(),
  LINK_ETTERSENDE: z.string(),
  LINK_DOKUMENTOVERSIKT: z.string(),
  LINK_MELD_FRA_OM_ENDRINGER: z.string(),
  LINK_SAKSBEHANDLINGSTIDER_UFORETRYGD: z.string(),
  LINK_DITT_LOKALE_NAV_KONTOR: z.string(),
  LINK_REGELVERKSENDRINGER: z.string(),
  LINK_REPRESENTASJON_TILLEGGSDATA: z.string(),
  LINK_SKRIV_TIL_OSS: z.string(),
  LINK_START_ARBEIDSOPPFOLGING: z.string(),

  // Hmmm
  UNLEASH_SERVER_API_URL: z.string().optional(),
  UNLEASH_SERVER_API_TOKEN: z.string().optional(),
  UNLEASH_SERVER_API_ENV: z.string().optional(),
  ACCESS_TOKEN: z.string().optional(),
  MOCK_SCENARIO: z.string().optional(),
  PORT: z.coerce.number().int().positive().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
  CI: z.string().optional(),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

// Kun tilgjengelig på server siden process.env kun er finnes der
export const serverEnv: ServerEnv = serverEnvSchema.parse(process.env)
