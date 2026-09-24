import Brødsmulesti from '@/components/Brødsmulesti/Brødsmulesti'
import { FullmaktModal } from '@/components/FullmaktModal/FullmaktModal'
import RepresentasjonBanner from '@/components/RepresentasjonBanner'
import { VeilederBanner } from '@/components/VeilederBanner/VeilederBanner'
import { env } from '@/env'
import { NaisMetaTags } from '@nais/apm/react'
import '@navikt/ds-css'
import { Theme, Alert } from '@navikt/ds-react'
import '@navikt/ds-tokens/dist/tokens.css'
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr'
import Script from 'next/script'
import { connection } from 'next/server'
import { Suspense } from 'react'
import '../global.css'
import { ApmErrorBoundary } from './ApmErrorBoundary'
import { ApmRouteTracker } from './ApmRouteTracker'
import './layout.css'

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  // Miljøvariabler for borger og veileder i injectes runtime til samme bundle.
  // For at det skal fungere må slå av prerendering ved å vente til en request kommer inn.
  //  https://nextjs.org/docs/app/guides/environment-variables#runtime-environment-variables
  //  https://nextjs.org/docs/app/api-reference/functions/connection
  await connection()

  const Decorator = await fetchDecoratorReact({
    env: env('DECORATOR_ENV'),
    params: {
      context: 'privatperson',
      chatbot: true,
      chatbotVisible: false,
    },
  })

  const apmErrorFallback = (
    <Alert variant="error" role="alert">
      Noe gikk galt. Prøv igjen senere.
    </Alert>
  )

  if (env('MODE') === 'veileder') {
    return (
      <html lang="no">
        <head>
          <title>Din uføretrygd - Veileder</title>
          <NaisMetaTags />
        </head>
        <body>
          <Theme>
            <ApmErrorBoundary fallback={apmErrorFallback}>
              <VeilederBanner />
              <main className="main-content" id="maincontent" tabIndex={-1}>
                <Brødsmulesti mode="veileder" />
                {children}
                <Suspense fallback={null}>
                  <ApmRouteTracker />
                </Suspense>
              </main>
            </ApmErrorBoundary>
          </Theme>
        </body>
      </html>
    )
  }

  const REPRESENTASJON_BANNER = env('REPRESENTASJON_BANNER')
  return (
    <html lang="no">
      <head>
        <title>Din uføretrygd - nav.no</title>
        <NaisMetaTags />
        <Decorator.HeadAssets />
      </head>
      <body>
        <Theme>
          <ApmErrorBoundary fallback={apmErrorFallback}>
            <div className="layout-wrapper">
              <Decorator.Header />
              <RepresentasjonBanner />
              <main className="main-content" id="maincontent" tabIndex={-1}>
                <Brødsmulesti mode="borger" />
                {children}
                <Suspense fallback={null}>
                  <ApmRouteTracker />
                </Suspense>
              </main>
              <Decorator.Footer />
              <Decorator.Scripts loader={Script} />
              <script type="module" src={`${REPRESENTASJON_BANNER}/banner.js`} async></script>
              <script src="https://widget.uxsignals.com/embed.js" async></script>
              <FullmaktModal />
            </div>
          </ApmErrorBoundary>
        </Theme>
      </body>
    </html>
  )
}

export default RootLayout
