import React from 'react'
import { hentSaksoversikt } from '@/api/endpoints'
import { Saksoversikt } from '@/sections/Saksoversikt/Saksoversikt'
import { mapTilSaksoversiktType } from '@/sections/Saksoversikt/saksoversiktType'
import { Alert } from '@navikt/ds-react'
import { resolveErrorText } from '@/utils/resolveErrorText/resolveErrorText'
import getEnv from '@/utils/env'

interface Props {
  searchParams: Promise<{ saksid: number; pid: string }>
}

const SaksoversiktPage: React.FC<Props> = async ({ searchParams }) => {
  const params = await searchParams
  const saksid = params?.saksid
  const pid = params?.pid
  const mode = getEnv('MODE')

  if (saksid) {
    const saksoversiktResponse = await hentSaksoversikt(saksid, pid)
    const saksoversikt =
      saksoversiktResponse.saksoversiktResponse && mapTilSaksoversiktType(saksoversiktResponse.saksoversiktResponse)
    if (saksoversikt) {
      return <Saksoversikt saksoversikt={saksoversikt} mode={mode} />
    } else
      return (
        <section className="main-content">
          <Alert variant="error" role="alert">
            {resolveErrorText(saksoversiktResponse.backendError?.message)}
          </Alert>
        </section>
      )
  }
}

export default SaksoversiktPage
