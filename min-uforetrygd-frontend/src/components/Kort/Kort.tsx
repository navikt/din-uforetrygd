import { BodyShort, Box, Heading, HStack, VStack } from '@navikt/ds-react'
import { ChevronRightIcon, FileExportIcon } from '@navikt/aksel-icons'
import styles from './kort.module.css'
import React, {ForwardRefExoticComponent, RefAttributes, SVGProps} from 'react'
import { getFullmaktProps } from '@/utils/fullmakt'
import {Innloggingstype} from "@/const";


interface IKortProps {
  title: string
  description?: string
  href: string
  icon?: ForwardRefExoticComponent<SVGProps<SVGSVGElement> & RefAttributes<SVGSVGElement>>
  showFullmaktWarning?: boolean,
  visInnloggingsModal?: boolean,
  innloggingstype: Innloggingstype,
}

export const Kort: React.FC<IKortProps> = (props) => {

  type InnloggingsnivaaProps = Record<string, true>

  function showModal(): InnloggingsnivaaProps {
    const modalProperties: InnloggingsnivaaProps = {}
    if ((props.innloggingstype as Innloggingstype) === Innloggingstype.LEVEL3 && props.visInnloggingsModal) {
      modalProperties['data-innloggingstype'] = true
    }
    return modalProperties
  }

  return (
    <a href={props.href} className={styles.kort} {...getFullmaktProps(props.showFullmaktWarning)} {...showModal()}>
      <Box borderRadius="large" borderWidth="1" padding="5" className={styles.kortBox}>
        <HStack align="center" justify="space-between" wrap={false}>
          <HStack gap="6" align="center" wrap={false}>
            <Box
              background={"surface-action-subtle"}
              className={styles.kortIcon}
              borderColor={"border-default"}
              borderRadius="xlarge"
              padding="3"
              aria-hidden
            >
              {props.icon ? <props.icon fontSize="3rem" /> : <FileExportIcon />}
            </Box>
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
      </Box>
    </a>
  )
}
