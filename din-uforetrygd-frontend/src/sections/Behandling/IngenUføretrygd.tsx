import styles from '@/sections/UforeStatusGuidePanel/uforestatusGuidePanel.module.css'
import { BodyLong, GuidePanel, Heading, Link, VStack } from '@navikt/ds-react'
import { getUrl } from '@/utils/getUrl'

export const IngenUføretrygd = async () => {
  const dittLokaleNavKontorLenke = await getUrl({ urlFromEnv: 'LINK_DITT_LOKALE_NAV_KONTOR' })

  return (
    <div className={styles.guidepanelWrapper}>
      <section aria-label="Saken din">
        <GuidePanel poster className={styles.ingenUforetrygd}>
          <VStack gap="space-12">
            <Heading level="2" size="medium">
              Du har ikke uføretrygd
            </Heading>
            <BodyLong>
              Før du søker om uføretrygd må det være avklart om du har muligheter til å være i arbeid. Det er vi som
              kommer frem til dette i samarbeid med deg. Kontakt{' '}
              <Link href={dittLokaleNavKontorLenke} className={styles.link}>
                ditt lokale Nav-kontor
              </Link>{' '}
              for veiledning.
            </BodyLong>
          </VStack>
        </GuidePanel>
      </section>
    </div>
  )
}
