import { HGrid } from '@navikt/ds-react'

interface IKortGridProps {
  children: React.ReactNode
}

export const KortGrid: React.FC<IKortGridProps> = (props) => {
  return (
    <HGrid gap="6" columns={{ md: 2 }}>
      {props.children}
    </HGrid>
  )
}
