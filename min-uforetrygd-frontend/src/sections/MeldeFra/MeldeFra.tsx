import { Visningskriterier } from '@/const'
import { Box, Link, Heading } from '@navikt/ds-react'
import getEnv from '@/utils/env'

interface IMeldeFra {
  visningskriterier: Visningskriterier[]
}

export const MeldeFra: React.FC<IMeldeFra> = ({ visningskriterier }) => {
  if (visningskriterier.includes(Visningskriterier.Uforetrygd)) {
    const link = getEnv('LINK_MELD_FRA_OM_ENDRINGER')
    return (
      <section>
        <Box background="surface-alt-3-subtle" padding="4" borderRadius="xlarge">
          <Heading level="2" size="medium">
            Husk å gi oss beskjed om endringer i din situasjon
          </Heading>
          <Link href={link}>Se hvile endringer du må si fra om og hvordan du sier fra.</Link>
        </Box>
      </section>
    )
  }
}
