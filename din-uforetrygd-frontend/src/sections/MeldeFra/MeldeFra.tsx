import { Visningskriterier } from '@/const'
import styles from './MeldeFra.module.css'
import '@navikt/ds-tokens/dist/tokens.css'
import '@navikt/ds-css'
import { Box, Heading, Link, VStack } from '@navikt/ds-react'
import { env } from '@/env'

interface IMeldeFra {
  visningskriterier: Visningskriterier[]
}

export const MeldeFra: React.FC<IMeldeFra> = ({ visningskriterier }) => {
  if (visningskriterier.includes(Visningskriterier.Uforetrygd)) {
    return (
      <section className={styles.meldeFra}>
        <Box background="accent-moderate" paddingBlock="space-32" paddingInline="space-24" borderRadius="12">
          <VStack gap="space-8">
            <Heading level="2" size="medium">
              Husk å gi oss beskjed om endringer i din situasjon
            </Heading>
            <Link href={env('LINK_MELD_FRA_OM_ENDRINGER')}>
              Se hvilke endringer du må si fra om og hvordan du sier fra.
            </Link>
          </VStack>
        </Box>
      </section>
    )
  }
}
