import { hentJournalposter } from '@/api/hentJournalposter'
import { Dokumentoversikt } from '@/sections/Dokumentoversikt/Dokumentoversikt'

interface DokumentoversiktPageProps {
  searchParams: Promise<{ pid?: string }>
}

const DokumentoversiktPage = async ({ searchParams }: DokumentoversiktPageProps) => {
  const { pid } = await searchParams
  const raaJournalposter = await hentJournalposter()

  return <Dokumentoversikt pid={pid} raaJournalposter={raaJournalposter} />
}

export default DokumentoversiktPage
