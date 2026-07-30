'use client'

import { Skeleton } from '@navikt/ds-react'
import { Suspense, use } from 'react'

interface Props<T> {
  promise: Promise<T>
  fallback?: React.ReactNode
  render: (value: T) => React.ReactNode
  width?: string
}

function DataLoader<T>({ promise, render }: { promise: Promise<T>; render: (value: T) => React.ReactNode }) {
  const value = use(promise)
  return <>{render(value)}</>
}

export function SkeletonLoader<T>({ promise, fallback, render, width = '5rem' }: Props<T>) {
  return (
    <Suspense fallback={fallback ?? <Skeleton variant="text" as="span" width={width} />}>
      <DataLoader promise={promise} render={render} />
    </Suspense>
  )
}
