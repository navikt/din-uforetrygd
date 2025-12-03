import { BoxNew, Heading, HGrid, Hide, LinkCard, VStack } from '@navikt/ds-react'
import {
  BulletListIcon,
  CalculatorIcon,
  EnvelopeClosedIcon,
  FolderFileIcon,
  PersonTallShortIcon,
  PlusMinusSlashIcon,
  WalletIcon,
} from '@navikt/aksel-icons'
import { Innloggingstype, Visningskriterier } from '@/const'
import filterShowFor, { matchAll, matchSome } from '@/utils/filterShowFor'
import { getUrl } from '@/utils/getUrl'
import { MinIdDokumentModal } from '@/components/MidIdDokumentModal/MinIdDokumentModal'
import { LinkCardAnchor, LinkCardDescription, LinkCardIcon, LinkCardTitle } from '@navikt/ds-react/LinkCard'
import React from 'react'
import { getFullmaktProps } from '@/utils/fullmakt'
import { showModal } from '@/utils/showMinIdModal'

interface IInformasjonOgRegistreringerProps {
  visningskriterier: Visningskriterier[]
  pid: string | undefined
  bprofFullmakt: boolean
  innloggingstype: Innloggingstype
}

const getLinks = async (pid: string | undefined, bprofFullmakt: boolean) => [
  {
    href: await getUrl({ urlFromEnv: 'LINK_UTBETALINGER', pid: pid }),
    title: 'Utbetalinger',
    description: 'Oversikt og detaljer',
    icon: <WalletIcon fontSize="2rem" />,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_INNTEKTSPLANLEGGER', pid: pid }),
    title: 'Inntektsplanlegger',
    description: 'Meld fra om endring i inntekt',
    icon: <CalculatorIcon fontSize="2rem" />,
    showFor: matchAll([Visningskriterier.Uforetrygd]),
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_DOKUMENTOVERSIKT', pid: pid }),
    title: 'Se alle dokumentene dine',
    description: 'Gå til dokumenter',
    icon: <FolderFileIcon fontSize="2rem" />,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: true,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_SKATTETREKK', pid: pid }),
    title: 'Frivillig skattetrekk',
    description: 'Registrer tilleggstrekk',
    icon: <PlusMinusSlashIcon fontSize="2rem" />,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_FAMILIEFORHOLD', pid: pid }),
    title: 'Familieforhold',
    description: 'Samboerforhold, sivilstand, barn',
    icon: <PersonTallShortIcon fontSize="2rem" />,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: bprofFullmakt ? 'LINK_BPROF_FULLMAKTER' : 'LINK_FULLMAKTER', pid: pid }),
    title: 'Dine fullmakter',
    description: 'Gi fullmakt og se dine fullmakter',
    icon: <BulletListIcon fontSize="2rem" />,
    showFor: true,
    showFullmaktWarning: true,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_ETTERSENDE', pid: pid }),
    title: 'Ettersend dokumentasjon',
    description: 'Ettersend dokumenter om saken din',
    icon: <EnvelopeClosedIcon fontSize="2rem" />,
    showFor: matchSome([Visningskriterier.SakTilBehandling, Visningskriterier.Uforetrygd]),
    showFullmaktWarning: true,
    visInnloggingsModal: false,
  },
]

export const InformasjonOgRegistreringer: React.FC<IInformasjonOgRegistreringerProps> = async (props) => {
  const links = await getLinks(props.pid, props.bprofFullmakt)
  const relevantLinks = filterShowFor(props.visningskriterier, links)
  return (
    <section aria-label="Snarveier">
      <VStack gap="5">
        <Heading level="2" size="medium">
          Snarveier
        </Heading>
        <HGrid gap="6" columns={{ md: 2 }}>
          {relevantLinks.map((link) => (
            <LinkCard key={link.title}>
              <Hide below="md" asChild>
                <BoxNew asChild borderRadius="8" padding="space-8" background="accent-moderateA">
                  <LinkCardIcon>{link.icon}</LinkCardIcon>
                </BoxNew>
              </Hide>
              <LinkCardTitle>
                <LinkCardAnchor
                  href={link.href ?? ''}
                  {...getFullmaktProps(link.showFullmaktWarning)}
                  {...showModal(props.innloggingstype, link.visInnloggingsModal)}
                >
                  {link.title}
                </LinkCardAnchor>
              </LinkCardTitle>
              <LinkCardDescription>{link.description}</LinkCardDescription>
            </LinkCard>
          ))}
          <MinIdDokumentModal innloggingstype={props.innloggingstype} />
        </HGrid>
      </VStack>
    </section>
  )
}
