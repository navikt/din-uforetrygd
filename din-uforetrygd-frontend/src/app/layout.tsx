import { Theme } from '@navikt/ds-react'
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr'
import Script from 'next/script'
import '../global.css'
import './layout.css'
import '@navikt/ds-tokens/dist/tokens.css'
import '@navikt/ds-css'
import Brødsmulesti from '@/components/Brødsmulesti/Brødsmulesti'
import { FullmaktModal } from '@/components/FullmaktModal/FullmaktModal'
import RepresentasjonBanner from '@/components/RepresentasjonBanner'
import { VeilederBanner } from '@/components/VeilederBanner/VeilederBanner'
import { env } from '@/env'
import InitializeFaro from '@/utils/faro/faro'
import { connection } from 'next/server'

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  // Miljøvariabler for borger og veileder i injectes runtime til samme bundle.
  // For at det skal fungere må slå av prerendering ved å vente til en request kommer inn.
  //  https://nextjs.org/docs/app/guides/environment-variables#runtime-environment-variables
  //  https://nextjs.org/docs/app/api-reference/functions/connection
  await connection()

  const Decorator = await fetchDecoratorReact({
    env: env().DECORATOR_ENV,
    params: {
      context: 'privatperson',
      chatbot: true,
      chatbotVisible: false,
    },
  })

  if (env().MODE === 'veileder') {
    return (
      <html lang="no">
        <head>
          <title>Din uføretrygd - Veileder</title>
        </head>
        <body>
          <Theme>
            <VeilederBanner />
            <main className="main-content" id="maincontent" tabIndex={-1}>
              <Brødsmulesti mode="veileder" />
              {children}
            </main>
            <InitializeFaro url={env().FARO_URL} appName={env().NAIS_APP_NAME} />
          </Theme>
        </body>
      </html>
    )
  }

  const REPRESENTASJON_BANNER = env().REPRESENTASJON_BANNER
  return (
    <html lang="no">
      <head>
        <title>Din uføretrygd - nav.no</title>
        <Decorator.HeadAssets />
      </head>
      <body>
        <Theme>
          <div className="layout-wrapper">
            <Decorator.Header />
            <RepresentasjonBanner />
            <main className="main-content" id="maincontent" tabIndex={-1}>
              <Brødsmulesti mode="borger" />
              {children}
            </main>
            <Decorator.Footer />
            <Decorator.Scripts loader={Script} />
            <script type="module" src={`${REPRESENTASJON_BANNER}/banner.js`} async></script>
            <script src="https://widget.uxsignals.com/embed.js" async></script>
            <FullmaktModal />
            <InitializeFaro url={env().FARO_URL} appName={env().NAIS_APP_NAME} />
          </div>
        </Theme>
      </body>
    </html>
  )
}

export default RootLayout
