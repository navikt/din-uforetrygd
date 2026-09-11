import { z } from 'zod'

const serverEnvSchema = z.object({
  MODE: z.enum(['borger', 'veileder']),
  DECORATOR_ENV: z.enum(['dev', 'prod']).default('prod'),
  DIN_UFORETRYGD_BACKEND: z.string(),
  UFORE_VARSLER: z.string(),
  DIN_UFORETRYGD_BACKEND_SCOPE: z.string(),
  UFORE_VARSLER_SCOPE: z.string(),
  REPRESENTASJON_BANNER: z.url().optional(),

  LINK_SOKNAD_GRADERT_UFORE: z.url(),
  LINK_SOKNAD_UFORE: z.url(),
  LINK_SOKNAD_BARNETILLEGG: z.url(),
  LINK_LES_MER_OM_UFORETRYGD: z.url(),
  LINK_ENDRE_KONTONUMMER: z.url(),
  LINK_PERSONOPPLYSNINGER: z.url(),
  LINK_OKONOMISKE_TILLEGG: z.url(),
  LINK_KLAGE: z.url(),
  LINK_UTBETALINGER: z.url(),
  LINK_INNTEKTSPLANLEGGER: z.url(),
  LINK_SKATTETREKK: z.url(),
  LINK_FAMILIEFORHOLD: z.url(),
  LINK_FULLMAKTER: z.url(),
  LINK_ETTERSENDE: z.url(),
  LINK_DOKUMENTOVERSIKT: z.url(),
  LINK_MELD_FRA_OM_ENDRINGER: z.url(),
  LINK_SAKSBEHANDLINGSTIDER_UFORETRYGD: z.url(),
  LINK_DITT_LOKALE_NAV_KONTOR: z.url(),
  LINK_REGELVERKSENDRINGER: z.url(),
  LINK_REPRESENTASJON_TILLEGGSDATA: z.url(),
  LINK_SKRIV_TIL_OSS: z.url(),
  LINK_START_ARBEIDSOPPFOLGING: z.url(),

  UNLEASH_SERVER_API_URL: z.url(),
  UNLEASH_SERVER_API_TOKEN: z.string(),
  UNLEASH_SERVER_API_ENV: z.string(),
  ACCESS_TOKEN: z.string().optional(),
  MOCK_SCENARIO: z.string().optional(),
  PORT: z.coerce.number().int().positive().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
  CI: z.string().optional(),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

let serverEnv: ServerEnv | undefined

// Kun tilgjengelig på server siden process.env kun er finnes der
export function env<Key extends keyof ServerEnv>(key: Key): ServerEnv[Key] {
  const serverEnv = validateEnv()
  return serverEnv[key]
}

export const validateEnv = () => {
  serverEnv ??= serverEnvSchema.parse(process.env)
  return serverEnv
}
