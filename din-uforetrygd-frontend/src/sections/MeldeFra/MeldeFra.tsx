import { Visningskriterier } from '@/const'
import styles from './MeldeFra.module.css'
import { getUrl } from '@/utils/getUrl/getUrl'
import '@navikt/ds-tokens'
import '@navikt/ds-css'
import { Box, Heading, Link, VStack } from '@navikt/ds-react'

interface IMeldeFra {
  visningskriterier: Visningskriterier[]
}

export const MeldeFra: React.FC<IMeldeFra> = async ({ visningskriterier }) => {
  if (visningskriterier.includes(Visningskriterier.Uforetrygd)) {
    const link = await getUrl({ urlFromEnv: 'LINK_MELD_FRA_OM_ENDRINGER' })
    return (
      <section className={styles.meldeFra}>
        <Box background="accent-moderate" paddingBlock="space-32" paddingInline="space-24" borderRadius="12">
          <VStack gap="space-8">
            <Heading level="2" size="medium">
              Husk å gi oss beskjed om endringer i din situasjon
            </Heading>
            <Link href={link}>Se hvilke endringer du må si fra om og hvordan du sier fra.</Link>
          </VStack>
        </Box>
      </section>
    )
  }
}
