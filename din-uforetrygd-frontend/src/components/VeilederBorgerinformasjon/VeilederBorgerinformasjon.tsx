import { BodyShort, Box, CopyButton, HStack } from '@navikt/ds-react'
import getEnv from '@/utils/env'
import styles from './VeilederBorgerinformasjon.module.css'

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
    <Box borderWidth="0 0 1 0" borderColor="neutral-subtle">
      <HStack align="center" gap="space-8" className={styles.wrapper} paddingInline="space-24" paddingBlock="space-8">
        <BodyShort data-testid="borger-fnr" size="small" weight="semibold">
          F.nr.: {formatFnr(pid)}
        </BodyShort>
        <CopyButton size="small" copyText={pid} />
      </HStack>
    </Box>
  )
}
