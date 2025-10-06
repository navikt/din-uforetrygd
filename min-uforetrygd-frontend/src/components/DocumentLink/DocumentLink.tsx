import { Detail, Link, VStack } from '@navikt/ds-react'
import { ExternalLinkIcon } from '@navikt/aksel-icons'
import React from 'react'
import { readableFileSize } from '@/components/DocumentLink/utils'
import styles from './documentLink.module.css'

interface IDocumentLink {
  href: string
  fileSize?: number
  children: React.ReactNode
}

export const DocumentLink: React.FC<IDocumentLink> = (props) => {
  return (
    <VStack>
      <Link
        href={props.href}
        target="_blank"
        className={styles.link}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {props.children}
        <ExternalLinkIcon />
      </Link>
      {props.fileSize && <Detail>{readableFileSize(props.fileSize)}</Detail>}
    </VStack>
  )
}
