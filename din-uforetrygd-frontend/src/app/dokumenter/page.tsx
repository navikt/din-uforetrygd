import { hentJournalposter } from '@/api/hentJournalposter'
import { SaksDokumenter } from '@/sections/SaksDokumenter/SaksDokumenter'

interface DokumenterPageProps {
  searchParams: Promise<{ pid?: string }>
}

const DokumenterPage = async ({ searchParams }: DokumenterPageProps) => {
  const params = await searchParams
  const pid = params?.pid
  const raaJournalposter = await hentJournalposter(pid)

  return <SaksDokumenter pid={pid} raaJournalposter={raaJournalposter} />
}

export default DokumenterPage
