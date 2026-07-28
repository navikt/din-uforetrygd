import { BodyShort, Box, CopyButton, HStack, InternalHeader, Spacer } from '@navikt/ds-react'
import { InternalHeaderTitle, InternalHeaderUser } from '@navikt/ds-react/InternalHeader'
import { headers } from 'next/headers'
import { hentBorgerInfo } from '@/api/hentBorgerInfo'
import { getAzureUserPayload } from '@/utils/getAzureUserPayload/getAzureUserPayload'

const formatFnr = (fnr: string) => {
  return `${fnr.slice(0, 6)} ${fnr.slice(6)}`
}

export const VeilederBanner = async () => {
  const veileder = await getAzureUserPayload()

  const headere = await headers()
  const kryptertPid = headere.get('x-kryptert-pid') ?? undefined

  const borgerInfo = kryptertPid && (await hentBorgerInfo(kryptertPid))

  return (
    <>
      <InternalHeader>
        <InternalHeaderTitle>Din uføretrygd</InternalHeaderTitle>
        <Spacer />
        <InternalHeaderUser name={veileder.name} />
      </InternalHeader>
      {borgerInfo && (
        <Box borderWidth="0 0 1 0" borderColor="neutral-subtle">
          <HStack align="center" gap="space-8" paddingInline="space-24" paddingBlock="space-8">
            <BodyShort size="small" weight="semibold">
              {borgerInfo.navn || ''}
            </BodyShort>
            <span aria-hidden="true">/</span>
            <BodyShort size="small" weight="semibold">
              {formatFnr(borgerInfo.pid)}
            </BodyShort>
            <CopyButton size="small" copyText={borgerInfo.pid} />
          </HStack>
        </Box>
      )}
    </>
  )
}
