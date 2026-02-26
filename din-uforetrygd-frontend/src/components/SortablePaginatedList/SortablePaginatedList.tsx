'use client'

import { Heading, Pagination, Select, VStack } from '@navikt/ds-react'
import React, { useEffect, useState } from 'react'
import { compareSortDate, paginateItems } from '@/components/SortablePaginatedList/utils'
import styles from './sortablepaginatedlist.module.css'

export interface ISortableItem {
  sortDate: string
}

interface ISortablePaginatedListProps<T> {
  items: T[]
  renderItemAction: (item: T, index: number) => React.ReactNode
  itemsPerPage: number
  itemTypeName: string
}

interface ISortablePaginatedListHeadingProps {
  itemsLength: number
  paginatedItemsLength: number
  itemTypeName: string
  handleSort: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const SortablePaginatedList = <T extends ISortableItem>({
  items,
  renderItemAction,
  itemsPerPage,
  itemTypeName,
}: ISortablePaginatedListProps<T>) => {
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc')
  const [pageState, setPageState] = useState(1)
  const [paginatorSize, setPaginatorSize] = useState<undefined | 'small' | 'xsmall'>(undefined)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      if (width <= 540) {
        setPaginatorSize('xsmall')
      } else if (width <= 768) {
        setPaginatorSize('small')
      } else {
        setPaginatorSize(undefined)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const sortedItems = React.useMemo(() => [...items].sort(compareSortDate(sortDirection)), [items, sortDirection])
  const paginatedItems = paginateItems(pageState, itemsPerPage, sortedItems)
  const showPagination = items.length > itemsPerPage

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortDirection(e.target.value as 'asc' | 'desc')
  }

  return (
    <>
      <SortablePaginatedListHeading
        itemsLength={items.length}
        paginatedItemsLength={paginatedItems.length}
        itemTypeName={itemTypeName}
        handleSort={handleSort}
      />
      <ul className={styles.sortableList}>
        {paginatedItems.map((item, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <li key={index}>{renderItemAction(item, index)}</li>
        ))}
      </ul>
      {showPagination && (
        <Pagination
          className={styles.pagination}
          prevNextTexts={paginatorSize !== 'xsmall'}
          page={pageState}
          onPageChange={setPageState}
          count={Math.ceil(items.length / itemsPerPage)}
          boundaryCount={1}
          siblingCount={1}
          size={paginatorSize}
        />
      )}
    </>
  )
}

const SortablePaginatedListHeading: React.FC<ISortablePaginatedListHeadingProps> = (props) => {
  if (props.itemsLength > 0) {
    return (
      <VStack gap={'space-16'}>
        <Heading size="xsmall" level="3">
          Viser {props.paginatedItemsLength} av {props.itemsLength} {props.itemTypeName}
        </Heading>
        <Select label="Sorter etter" hideLabel size="small" onChange={props.handleSort} style={{ maxWidth: '150px' }}>
          <option value="desc">Nyeste først</option>
          <option value="asc">Eldste først</option>
        </Select>
      </VStack>
    )
  }

  return (
    <Heading size="xsmall" level="3">
      Du har ingen {props.itemTypeName} knyttet til saken din
    </Heading>
  )
}
