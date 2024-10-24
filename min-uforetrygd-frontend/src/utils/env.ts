import { unstable_noStore as noStore} from "next/cache";

type Env = "DECORATOR_ENV"
    | "MODE"
    | "UFORETRYGD_BACKEND"
    | "LINK_SOKNAD_GRADERT_UFORE"
    | "LINK_SOKNAD_UFORE"
    | "LINK_SOKNAD_BARNETILLEGG"

export default function getEnv(env: Env ) {
    noStore()
    return process.env[env]
}