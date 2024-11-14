import { Box, HStack, CopyButton, BodyShort } from '@navikt/ds-react'

import styles from './VeilederBorgerinformasjon.module.css'
import getEnv from '@/utils/env'

interface IVeilederBorgerInformasjonProps {
  pid?: string
}
const formatFnr = (fnr: string) => {
  return `${fnr.slice(0, 6)} ${fnr.slice(6)}`
}

export const VeilederBorgerinformasjon: React.FC<IVeilederBorgerInformasjonProps> = ({ pid }) => {
  const mode = getEnv('MODE') as 'borger' | 'veileder'
  if (mode !== 'veileder' || !pid) return null

  return (
    <Box background="bg-default" borderWidth="0 0 1 0" borderColor="border-divider">
      <HStack align="center" gap="2" className={styles.wrapper} paddingInline="6" paddingBlock="2">
        <BodyShort data-testid="borger-fnr" size="small" weight="semibold">
          F.nr.: {formatFnr(pid)}
        </BodyShort>
        <CopyButton size="small" copyText={pid} />
      </HStack>
    </Box>
  )
}
