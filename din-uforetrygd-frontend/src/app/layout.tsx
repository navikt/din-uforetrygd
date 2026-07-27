import { InternalHeader, Spacer, Theme } from '@navikt/ds-react'
import { InternalHeaderTitle, InternalHeaderUser } from '@navikt/ds-react/InternalHeader'
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr'
import Script from 'next/script'
import getEnv from '@/utils/env'
import '../global.css'
import './layout.css'
import '@navikt/ds-tokens/dist/tokens.css'
import '@navikt/ds-css'
import Brødsmulesti from '@/components/Brødsmulesti/Brødsmulesti'
import { FullmaktModal } from '@/components/FullmaktModal/FullmaktModal'
import RepresentasjonBanner from '@/components/RepresentasjonBanner'
import { VeilederBorgerinformasjon } from '@/components/VeilederBorgerinformasjon/VeilederBorgerinformasjon'
import InitializeFaro from '@/utils/faro/faro'
import { getAzureUserPayload } from '@/utils/getAzureUserPayload/getAzureUserPayload'

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const decoratorEnv = (getEnv('DECORATOR_ENV') ?? 'prod') as 'dev' | 'prod'
  const mode = getEnv('MODE') as 'borger' | 'veileder'
  const faroUrl = getEnv('FARO_URL')
  const appName = getEnv('NAIS_APP_NAME')

  const Decorator = await fetchDecoratorReact({
    env: decoratorEnv,
    params: {
      context: 'privatperson',
      chatbot: true,
      chatbotVisible: false,
    },
  })

  if (mode === 'veileder') {
    const veileder = await getAzureUserPayload()

    return (
      <html lang="no">
        <head>
          <title>Din uføretrygd - Veileder</title>
        </head>
        <body>
          <Theme>
            <InternalHeader>
              <InternalHeaderTitle>Din uføretrygd</InternalHeaderTitle>
              <Spacer />
              <InternalHeaderUser name={veileder.name} />
            </InternalHeader>
            <VeilederBorgerinformasjon />
            <main className="main-content" id="maincontent" tabIndex={-1}>
              <Brødsmulesti mode="veileder" />
              {children}
            </main>
            <InitializeFaro url={faroUrl} appName={appName} />
          </Theme>
        </body>
      </html>
    )
  }

  const REPRESENTASJON_BANNER = getEnv('REPRESENTASJON_BANNER')
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
            <InitializeFaro url={faroUrl} appName={appName} />
          </div>
        </Theme>
      </body>
    </html>
  )
}

export default RootLayout
