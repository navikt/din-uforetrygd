'use client'

import { HStack, Link, VStack } from '@navikt/ds-react'
import styles from './brødsmulesti.module.css'
import { usePathname } from 'next/navigation'

export interface Brødsmuler {
  tittel: string
  url: string
}

const allePaths: Record<string, Brødsmuler> = {
  minside: { tittel: 'Min side', url: '/minside' },
  '': { tittel: 'Din uføretrygd', url: '/uforetrygd/selvbetjening' },
  saksoversikt: { tittel: 'Saksoversikt', url: '/uforetrygd/selvbetjening/saksoversikt' },
}

export default function Brødsmulesti() {
  const pathname = usePathname()
  const brødsmuler = [allePaths['minside'], allePaths['']]

  const segments = pathname.split('/').filter(Boolean)

  segments.forEach((segment) => brødsmuler.push(allePaths[segment]))

  return (
    <VStack>
      <HStack>
        {brødsmuler.map(({ tittel, url }, index) => (
          <div className={styles.brodsmuleLink} key={tittel}>
            {index !== brødsmuler.length - 1 ? (
              <Link href={url} underline={false}>
                {tittel}
              </Link>
            ) : (
              <span className={styles.aktivLenke}>{tittel}</span>
            )}
          </div>
        ))}
      </HStack>
    </VStack>
  )
}
