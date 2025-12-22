import React from 'react'
import { hentSaksoversikt } from '@/api/endpoints'
import { Saksoversikt } from '@/sections/Saksoversikt'
import { mapTilSaksoversiktType } from '@/sections/Saksoversikt/saksoversiktType'

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
    } else return <div>Laster</div>
  }
}

export default SaksoversiktPage
