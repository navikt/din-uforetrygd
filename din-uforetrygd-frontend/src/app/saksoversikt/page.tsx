import { Alert } from '@navikt/ds-react'
import type React from 'react'
import { hentSaksoversikt } from '@/api/hentSaksoversikt'
import { Saksoversikt } from '@/sections/Saksoversikt/Saksoversikt'
import { mapTilSaksoversiktType } from '@/sections/Saksoversikt/saksoversiktType'
import { resolveErrorText } from '@/utils/resolveErrorText/resolveErrorText'

interface Props {
  searchParams: Promise<{ saksid: number; pid: string }>
}

const SaksoversiktPage: React.FC<Props> = async ({ searchParams }) => {
  const params = await searchParams
  const saksid = params?.saksid
  const pid = params?.pid

  if (saksid) {
    const resultat = await hentSaksoversikt(saksid, pid)
    if (!resultat.ok)
      return (
        <section className="main-content">
          <Alert variant="error" role="alert">
            {resolveErrorText(resultat.error)}
          </Alert>
        </section>
      )
    const saksoversikt = resultat.data && mapTilSaksoversiktType(resultat.data)

    return <Saksoversikt saksoversikt={saksoversikt} />
  }
}

export default SaksoversiktPage
