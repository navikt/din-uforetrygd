import { unstable_noStore as noStore } from "next/cache";

type Env =
  | "DECORATOR_ENV"
  | "MODE"
  | "UFORETRYGD_BACKEND"
  | "LINK_SOKNAD_GRADERT_UFORE"
  | "LINK_SOKNAD_UFORE"
  | "LINK_SOKNAD_BARNETILLEGG"
  | "LINK_LES_MER_OM_UFORETRYGD"
  | "LINK_ENDRE_KONTONUMMER"
  | "LINK_PERSONOPPLYSNINGER"
  | "LINK_OKONOMISKE_TILLEGG"
  | "LINK_KLAGE";

export default function getEnv(env: Env) {
  noStore();
  return process.env[env];
}

