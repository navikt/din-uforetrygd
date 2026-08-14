import { hentJournalposter } from '@/api/hentJournalposter'
import { Dokumentoversikt } from '@/sections/Dokumentoversikt/Dokumentoversikt'

interface DokumenterPageProps {
  searchParams: Promise<{ pid?: string }>
}

const DokumenterPage = async ({ searchParams }: DokumenterPageProps) => {
  const params = await searchParams
  const pid = params?.pid
  const raaJournalposter = await hentJournalposter(pid)

  return <Dokumentoversikt pid={pid} raaJournalposter={raaJournalposter} />
}

export default DokumenterPage
