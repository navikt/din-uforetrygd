import { unstable_noStore as noStore} from "next/cache";

type Env = "DECORATOR_ENV" | "MODE"

export default function getEnv(env: Env ) {
    noStore()
    return process.env[env]
}