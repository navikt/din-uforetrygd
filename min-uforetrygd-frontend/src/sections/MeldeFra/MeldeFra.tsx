import { Visningskriterier } from '@/const'
import { Box, Link, Heading, VStack } from '@navikt/ds-react'
import styles from './MeldeFra.module.css'
import { getUrl } from '@/utils/getUrl'

interface IMeldeFra {
  visningskriterier: Visningskriterier[]
}

export const MeldeFra: React.FC<IMeldeFra> = async ({ visningskriterier }) => {
  if (visningskriterier.includes(Visningskriterier.Uforetrygd)) {
    const link = await getUrl('LINK_MELD_FRA_OM_ENDRINGER')
    return (
      <section className={styles.meldeFra}>
        <Box background="surface-action-subtle" paddingBlock="8" paddingInline="6" borderRadius="xlarge">
          <VStack gap="2">
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
