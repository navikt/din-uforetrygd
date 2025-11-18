import { InternalHeader, Spacer, Theme } from '@navikt/ds-react'
import { InternalHeaderTitle, InternalHeaderUser } from '@navikt/ds-react/InternalHeader'
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr'
import Script from 'next/script'
import getEnv from '@/utils/env'
import '../global.css'
import './layout.css'
import '@navikt/ds-tokens'
import '@navikt/ds-css/darkside'
import { getAzureUserPayload } from '@/utils/getAzureUserPayload'
import RepresentasjonBanner from '@/components/RepresentasjonBanner'
import FullmaktModal from '@/components/FullmaktModal'
import UndersøkelseEtteroppgjør2025 from '@/analyse/UndersøkelseEtteroppgjør2025'

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const decoratorEnv = (getEnv('DECORATOR_ENV') ?? 'prod') as 'dev' | 'prod'
  const mode = getEnv('MODE') as 'borger' | 'veileder'

  const Decorator = await fetchDecoratorReact({
    env: decoratorEnv,
    params: {
      context: 'privatperson',
      breadcrumbs: [
        {
          title: 'Min side',
          url: 'https://www.nav.no/minside',
        },
        {
          title: 'Din uføretrygd',
          url: 'https://www.nav.no/uføretrygd',
        },
      ],
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
            {decoratorEnv === 'dev' && <UndersøkelseEtteroppgjør2025 />}
            <InternalHeader>
              <InternalHeaderTitle>Din uføretrygd</InternalHeaderTitle>
              <Spacer />
              <InternalHeaderUser name={veileder.name} />
            </InternalHeader>
            {children}
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
          {decoratorEnv === 'dev' && <UndersøkelseEtteroppgjør2025 />}
          <Decorator.Header />
          <RepresentasjonBanner />
          {children}
          <Decorator.Footer />
          <Decorator.Scripts loader={Script} />
          <script type="module" src={`${REPRESENTASJON_BANNER}/banner.js`} async></script>
          <script src="https://widget.uxsignals.com/embed.js" async></script>
          <FullmaktModal />
        </Theme>
      </body>
    </html>
  )
}

export default RootLayout
