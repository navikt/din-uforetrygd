'use client'

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Box, VStack } from '@navikt/ds-react'
import { ACCORDION_APNET_EVENT } from '@navikt/nav-dekoratoren-moduler'
import { useState } from 'react'
import { umami } from '@/utils/umami'
import styles from './readmoretile.module.css'

interface IReadMoreTileProps {
  children: React.ReactNode
  content: React.ReactNode
}

export const ReadMoreTile: React.FC<IReadMoreTileProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    if (isOpen) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
      umami(ACCORDION_APNET_EVENT, { tittel: 'Dokument' })
    }
  }

  return (
    <Box className={`${styles.tile} ${isOpen && styles.tileOpenColour}`} borderRadius="8">
      <Box
        as="button"
        className={`${styles.tileHeader} ${isOpen && styles.tileOpenColour}`}
        onClick={handleOpen}
        borderRadius={isOpen ? '8 8 0 0' : '8'}
        padding="space-16"
      >
        <VStack gap="space-4">{props.children}</VStack>
        <div className={`${styles.tileChevron} ${isOpen ? styles.tileChevronOpen : styles.tileChevronClosed}`}>
          {isOpen ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
        </div>
      </Box>
      {isOpen && (
        <Box paddingBlock="space-0 space-16" paddingInline="space-16 space-0" width="100%" borderRadius="8">
          {props.content}
        </Box>
      )}
    </Box>
  )
}
