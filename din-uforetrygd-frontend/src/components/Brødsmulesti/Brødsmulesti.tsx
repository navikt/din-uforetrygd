import { HStack, Link, VStack } from '@navikt/ds-react'
import styles from './brødsmulesti.module.css'

export interface Brødsmuler {
  tittel: string
  url: string
}

interface Props {
  brødsmuler: Brødsmuler[]
}

export default function Brødsmulesti({ brødsmuler = [] }: Props) {
  const defaultBrødsmuler = [{ tittel: 'Min side', url: '/minside' }]

  brødsmuler.map((brødsmule) => defaultBrødsmuler.push(brødsmule))

  return (
    <VStack>
      <HStack>
        {defaultBrødsmuler.map(({ tittel, url }, index) => (
          <div className={styles.brodsmuleLink} key={tittel}>
            {index !== defaultBrødsmuler.length - 1 ? (
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
