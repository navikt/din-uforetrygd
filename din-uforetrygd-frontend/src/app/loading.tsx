import { Heading, Loader, VStack } from '@navikt/ds-react'
import type React from 'react'

export default function Laster() {
  return (
    <VStack justify={'center'} align={'center'} flexGrow={'1'} gap={'space-32'}>
      <Loader size="3xlarge" title="Laster inn..." />
      <Heading size={'medium'}>Laster inn...</Heading>
    </VStack>
  )
}
