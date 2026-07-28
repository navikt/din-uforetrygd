'use client'

import { HStack, Link } from '@navikt/ds-react'
import { usePathname, useSearchParams } from 'next/navigation'
import styles from './brødsmulesti.module.css'

const PATHS: Record<string, { tittel: string; url: string }> = {
  '': { tittel: 'Din uføretrygd', url: '/uforetrygd/selvbetjening' },
  saksoversikt: { tittel: 'Saksoversikt', url: '/uforetrygd/selvbetjening/saksoversikt' },
  'kommende-utbetalinger': { tittel: 'Kommende utbetalinger', url: '/uforetrygd/selvbetjening/kommende-utbetalinger' },
  'dine-muligheter': { tittel: 'Dine muligheter', url: '/uforetrygd/selvbetjening/dine-muligheter' },
  'finn-ut-mer': { tittel: 'Finn ut mer', url: '/uforetrygd/selvbetjening/dine-muligheter/finn-ut-mer' },
}

const MIN_SIDE = { tittel: 'Min side', url: '/minside' }

interface Props {
  mode: 'borger' | 'veileder'
}

export default function Brødsmulesti({ mode }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const pid = mode === 'veileder' ? searchParams.get('pid') : null
  const pidQuery = pid ? `?pid=${pid}` : ''

  const segments = pathname.split('/').filter(Boolean)
  const brødsmuler = [MIN_SIDE, PATHS[''], ...segments.flatMap((s) => (PATHS[s] ? [PATHS[s]] : []))]

  return (
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
  )
}
