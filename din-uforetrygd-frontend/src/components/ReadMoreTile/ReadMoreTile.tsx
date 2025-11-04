'use client'

import { Box, VStack } from '@navikt/ds-react'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { useState } from 'react'
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
    }
  }

  return (
    <Box.New className={styles.tile + " " + (isOpen && styles.tileOpenColour)} borderRadius="large">
      <Box.New
        as="button"
        className={styles.tileHeader + " " + (isOpen && styles.tileOpenColour)}
        onClick={handleOpen}
        borderRadius={isOpen ? 'large large 0 0' : 'large'}
        padding="4"
      >
        <VStack gap="1">{props.children}</VStack>
        <div className={`${styles.tileChevron} ${isOpen ? styles.tileChevronOpen : styles.tileChevronClosed}`}>
          {isOpen ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
        </div>
      </Box.New>

      {isOpen && (
        <Box.New paddingBlock="0 4" paddingInline="4 0" width="100%" borderRadius="large">
          {props.content}
        </Box.New>
      )}
    </Box.New>
  )
}
