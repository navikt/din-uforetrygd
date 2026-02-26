'use client'

import { HStack, Link, VStack } from '@navikt/ds-react'
import { usePathname, useSearchParams } from 'next/navigation'
import styles from './brødsmulesti.module.css'

export interface Brødsmuler {
  tittel: string
  url: string
}

const allePaths: Record<string, Brødsmuler> = {
  minside: { tittel: 'Min side', url: '/minside' },
  '': { tittel: 'Din uføretrygd', url: '/uforetrygd/selvbetjening' },
  saksoversikt: { tittel: 'Saksoversikt', url: '/uforetrygd/selvbetjening/saksoversikt' },
}

interface Props {
  mode: string | undefined
}

export default function Brødsmulesti({ mode }: Props) {
  const pathname = usePathname()
  const brødsmuler = [allePaths.minside, allePaths['']]

  const searchParams = useSearchParams()

  const pidQuery = mode === 'veileder' ? `?pid=${searchParams.get('pid')}` : ''

  const segments = pathname.split('/').filter(Boolean)

  segments.map((segment) => brødsmuler.push(allePaths[segment]))

  return (
    <VStack>
      <HStack>
        {brødsmuler.map(({ tittel, url }, index) => (
          <div className={styles.brodsmuleLink} key={tittel}>
            {index !== brødsmuler.length - 1 ? (
              <Link href={url + pidQuery} underline={false}>
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
