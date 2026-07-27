import { BodyShort, Box, CopyButton, HStack } from '@navikt/ds-react'
import { headers } from 'next/headers'
import { type DekryptertPidResponse, hentDekryptertPid } from '@/api/hentDekryptertPid'
import styles from './VeilederBorgerinformasjon.module.css'

const formatFnr = (fnr: string) => {
  return `${fnr.slice(0, 6)} ${fnr.slice(6)}`
}

export const VeilederBorgerinformasjon = async () => {
  const headere = await headers()
  const kryptertPid = headere.get('x-kryptert-pid') ?? undefined

  if (!kryptertPid) return null

  const pidResponse: DekryptertPidResponse = await hentDekryptertPid(kryptertPid)
  const dekryptertPid = pidResponse.pid

  if (!dekryptertPid) return null

  return (
    <Box borderWidth="0 0 1 0" borderColor="neutral-subtle">
      <HStack align="center" gap="space-8" className={styles.wrapper} paddingInline="space-24" paddingBlock="space-8">
        <BodyShort data-testid="borger-fnr" size="small" weight="semibold">
          F.nr.: {dekryptertPid}
        </BodyShort>
        <CopyButton size="small" copyText={dekryptertPid} />
      </HStack>
    </Box>
  )
}
