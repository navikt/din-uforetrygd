import '@navikt/ds-css'
import { InternalHeader, Spacer } from '@navikt/ds-react'
import { InternalHeaderTitle, InternalHeaderUser } from '@navikt/ds-react/InternalHeader'
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr'
import Script from 'next/script'
import getEnv from '@/utils/env'
import './layout.css'
import { getAzureUserPayload } from '@/utils/getAzureUserPayload'
import RepresentasjonBanner from '@/components/RepresentasjonBanner'

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
          url: 'https://www.nav.no',
        },
        {
          title: 'Uføretrygd',
          url: 'https://www.nav.no/uføretrygd',
        },
      ],
    },
  })

  if (mode === 'veileder') {
    const veileder = await getAzureUserPayload()

    return (
      <html lang="no">
        <body>
          <InternalHeader>
            <InternalHeaderTitle>Din uføretrygd</InternalHeaderTitle>
            <Spacer />
            <InternalHeaderUser name={veileder.name} />
          </InternalHeader>
          {children}
        </body>
      </html>
    )
  }

  const REPRESENTASJON_BANNER = getEnv('REPRESENTASJON_BANNER')
  return (
    <html lang="no">
      <head>
        <Decorator.HeadAssets />
      </head>
      <body>
        <Decorator.Header />
        <RepresentasjonBanner />
        {children}
        <Decorator.Footer />
        <Decorator.Scripts loader={Script} />
        <script type="module" src={`${REPRESENTASJON_BANNER}/banner.js`} async></script>
      </body>
    </html>
  )
}

export default RootLayout
