import React from 'react'
import { hentSaksoversikt } from '@/api/endpoints'
import { Saksoversikt } from '@/sections/Saksoversikt'
import { mapTilSaksoversiktType } from '@/sections/Saksoversikt/saksoversiktType'
import { Alert } from '@navikt/ds-react'
import { resolveErrorText } from '@/utils/resolveErrorText'

interface Props {
  searchParams: Promise<{ saksid: number }>
}

const SaksoversiktPage: React.FC<Props> = async ({ searchParams }) => {
  const params = await searchParams
  const saksid = params?.saksid
  if (saksid) {
    const saksoversiktResponse = await hentSaksoversikt(saksid)
    const saksoversikt =
      saksoversiktResponse.saksoversiktResponse && mapTilSaksoversiktType(saksoversiktResponse.saksoversiktResponse)
    console.log(saksoversikt)

    if (saksoversikt) {
      return <Saksoversikt saksoversikt={saksoversikt} />
    } else {
      return (
        <Alert variant="error" role="alert">
          {resolveErrorText(saksoversiktResponse.backendError?.message)}
        </Alert>
      )
    }
  }
}

export default SaksoversiktPage
