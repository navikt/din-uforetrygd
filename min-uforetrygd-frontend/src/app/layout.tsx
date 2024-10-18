import "@navikt/ds-css"
import { Heading } from "@navikt/ds-react"
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr"
import Script from "next/script"
import getEnv from "@/utils/env";

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const decoratorEnv = (getEnv("DECORATOR_ENV") ?? "prod") as "dev" | "prod"
    const mode = getEnv("MODE") as "borger" | "veileder"

    const Decorator = await fetchDecoratorReact({
        env: decoratorEnv
    })
    if (mode === "veileder") {
        return (
            <html lang="no">
                <body>
                    <Heading size="xlarge" level="1">{process.env.MODE}</Heading>
                    {children}
                </body>
            </html>
        )
    }

    return (
        <html lang="no">
            <head>
                <Decorator.HeadAssets/>
            </head>
            <body>
                <Decorator.Header/>
                    {children}
                <Decorator.Footer/>
                <Decorator.Scripts loader={Script}/>
            </body>
        </html>
    )
}

export default RootLayout