import { NextRequest } from 'next/server'
import getOboToken from '@/api/getOboToken'
import { redirect } from 'next/navigation'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ journalpostId: string; dokumentInfoId: string; variant: string }> }
) {
  const baseUrl = process.env.UFORETRYGD_BACKEND
  const { journalpostId, dokumentInfoId, variant: variant } = await params
  const token = await getOboToken()
  const pid = request.nextUrl.searchParams.get('pid')
  const requestHeaders: Record<string, string> = { Authorization: `Bearer ${token}` }

  if (pid) {
    requestHeaders.pid = pid
  }

  const response = await fetch(`${baseUrl}/api/dokument/${journalpostId}/${dokumentInfoId}/${variant}`, {
    headers: requestHeaders,
  })

  if (!response.ok) {
    redirect('')
  }

  const blob = await response.blob()

  return new Response(blob, {
    headers: { 'Content-Type': 'application/pdf', 'Content-Length': blob.size.toString() },
  })
}
