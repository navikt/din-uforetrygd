import { BoxNew, Heading, HGrid, Hide, LinkCard, VStack } from '@navikt/ds-react'
import {
  FileExportIcon,
  FileTextIcon,
  PersonGroupIcon,
  PersonPlusIcon,
  ReceiptIcon,
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
  heading?: string | undefined
  visningskriterier: Visningskriterier[]
  pid: string | undefined
  bprofFullmakt: boolean
  innloggingstype: Innloggingstype
  top: boolean | undefined
}

const getTopLinks = async (pid: string | undefined, visningskriterier: Visningskriterier[]) => [
  {
    href: await getUrl({ urlFromEnv: 'LINK_INNTEKTSPLANLEGGER', pid: pid }),
    title: 'Inntektsplanlegger',
    description: 'Meld fra om endring i inntekt',
    icon: <FileTextIcon fontSize="2rem" style={{ color: 'var(--ax-text-accent-subtle)' }} />,
    showFor: matchAll([Visningskriterier.Uforetrygd]),
    showFullmaktWarning: false,
    visInnloggingsModal: false,
    showOnTop: true,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_UTBETALINGER', pid: pid }),
    title: 'Utbetalinger',
    description: 'Oversikt og detaljer',
    icon: <WalletIcon fontSize="2rem" style={{ color: 'var(--ax-text-accent-subtle)' }} />,
    showFor: matchAll([Visningskriterier.Uforetrygd]),
    showFullmaktWarning: false,
    visInnloggingsModal: false,
    showOnTop: visningskriterier.includes(Visningskriterier.Uforetrygd),
  },
]

const getBottomLinks = async (
  pid: string | undefined,
  bprofFullmakt: boolean,
  visningskriterier: Visningskriterier[]
) => [
  {
    href: await getUrl({ urlFromEnv: 'LINK_UTBETALINGER', pid: pid }),
    title: 'Utbetalinger',
    description: 'Oversikt og detaljer',
    icon: <WalletIcon fontSize="2rem" style={{ color: 'var(--ax-text-accent-subtle)' }} />,
    showFor: matchAll([Visningskriterier.Uforetrygd]),
    showFullmaktWarning: false,
    visInnloggingsModal: false,
    showOnTop: !visningskriterier.includes(Visningskriterier.Uforetrygd),
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_DOKUMENTOVERSIKT', pid: pid }),
    title: 'Se alle dokumentene dine',
    description: 'Gå til dokumenter',
    icon: <FileTextIcon fontSize="2rem" style={{ color: 'var(--ax-text-accent-subtle)' }} />,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: true,
    showOnTop: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_SKATTETREKK', pid: pid }),
    title: 'Frivillig skattetrekk',
    description: 'Registrer tilleggstrekk',
    icon: <ReceiptIcon fontSize="2rem" style={{ color: 'var(--ax-text-accent-subtle)' }} />,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: false,
    showOnTop: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_FAMILIEFORHOLD', pid: pid }),
    title: 'Familieforhold',
    description: 'Samboerforhold, sivilstand, barn',
    icon: <PersonPlusIcon fontSize="2rem" style={{ color: 'var(--ax-text-accent-subtle)' }} />,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: false,
    showOnTop: false,
  },
  {
    href: await getUrl({ urlFromEnv: bprofFullmakt ? 'LINK_BPROF_FULLMAKTER' : 'LINK_FULLMAKTER', pid: pid }),
    title: 'Dine fullmakter',
    description: 'Gi fullmakt og se dine fullmakter',
    icon: <PersonGroupIcon fontSize="2rem" style={{ color: 'var(--ax-text-accent-subtle)' }} />,
    showFor: true,
    showFullmaktWarning: true,
    visInnloggingsModal: false,
    showOnTop: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_ETTERSENDE', pid: pid }),
    title: 'Ettersend dokumentasjon',
    description: 'Ettersend dokumenter om saken din',
    icon: <FileExportIcon fontSize="2rem" style={{ color: 'var(--ax-text-accent-subtle)' }} />,
    showFor: matchSome([Visningskriterier.SakTilBehandling, Visningskriterier.Uforetrygd]),
    showFullmaktWarning: true,
    visInnloggingsModal: false,
    showOnTop: false,
  },
]

export const SnarveiPanel: React.FC<IInformasjonOgRegistreringerProps> = async (props) => {
  const links = props.top
    ? await getTopLinks(props.pid, props.visningskriterier)
    : await getBottomLinks(props.pid, props.bprofFullmakt, props.visningskriterier)
  const relevantLinks = filterShowFor(props.visningskriterier, links)
  return (
    <>
      {relevantLinks.length > 0 && (
        <VStack gap="5">
          <Heading level="2" size="medium">
            {props.heading ? props.heading : 'Snarveier'}
          </Heading>
          <HGrid gap="6" columns={{ md: 2 }}>
            {relevantLinks.map((link) => (
              <LinkCard key={link.title}>
                <Hide below="md" asChild>
                  <BoxNew
                    asChild
                    borderRadius="8"
                    padding="space-8"
                    style={{ backgroundColor: 'var(--ax-bg-accent-moderateA)' }}
                  >
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
      )}
    </>
  )
}
