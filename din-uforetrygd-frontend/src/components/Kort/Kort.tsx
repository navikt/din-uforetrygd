import { BodyShort, BoxNew, Heading, HStack, VStack } from '@navikt/ds-react'
import { ChevronRightIcon, FileExportIcon } from '@navikt/aksel-icons'
import styles from './kort.module.css'
import React, { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'
import { getFullmaktProps } from '@/utils/fullmakt'
import { Innloggingstype } from '@/const'
import { showModal } from '@/utils/showMinIdModal'

interface IKortProps {
  title: string
  description?: string
  href: string
  icon?: ForwardRefExoticComponent<SVGProps<SVGSVGElement> & RefAttributes<SVGSVGElement>>
  showFullmaktWarning?: boolean
  visInnloggingsModal: boolean
  innloggingstype: Innloggingstype
}

export const Kort: React.FC<IKortProps> = (props) => {
  return (
    <a
      href={props.href}
      className={styles.kort}
      {...getFullmaktProps(props.showFullmaktWarning)}
      {...showModal(props.innloggingstype, props.visInnloggingsModal)}
    >
      <BoxNew borderRadius="large" borderWidth="1" padding="5" className={styles.kortBox}>
        <HStack align="center" justify="space-between" wrap={false}>
          <HStack gap="6" align="center" wrap={false}>
            <BoxNew
              background='accent-soft'
              className={styles.kortIcon}
              borderRadius="xlarge"
              padding="3"
              aria-hidden
            >
              {props.icon ? <props.icon fontSize="3rem" /> : <FileExportIcon />}
            </BoxNew>
            <VStack justify="center" gap="1">
              <Heading level="3" size="small" style={{ textDecoration: 'none' }}>
                {props.title}
              </Heading>
              {props.description && <BodyShort>{props.description}</BodyShort>}
            </VStack>
          </HStack>

          <span className={styles.chevronIcon} aria-hidden>
            <ChevronRightIcon fontSize="1.5rem" />
          </span>
        </HStack>
      </BoxNew>
    </a>
  )
}
