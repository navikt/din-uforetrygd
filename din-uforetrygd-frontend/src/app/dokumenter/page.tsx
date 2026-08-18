import { hentJournalposter } from '@/api/hentJournalposter'
import { Dokumentoversikt } from '@/sections/Dokumentoversikt/Dokumentoversikt'

interface DokumentoversiktPageProps {
  searchParams: Promise<{ pid?: string }>
}

const DokumentoversiktPage = async ({ searchParams }: DokumentoversiktPageProps) => {
  const params = await searchParams
  const pid = params?.pid
  const raaJournalposter = await hentJournalposter(pid)

  return <Dokumentoversikt pid={pid} raaJournalposter={raaJournalposter} />
}

export default DokumentoversiktPage
