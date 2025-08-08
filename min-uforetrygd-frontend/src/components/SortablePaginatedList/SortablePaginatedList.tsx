'use client'

import { Heading, HStack, Pagination, Select } from '@navikt/ds-react'
import React, { useState } from 'react'
import styles from './sortablepaginatedlist.module.css'
import { compareSortDate, paginateItems } from '@/components/SortablePaginatedList/utils'

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

  const sortedItems = React.useMemo(() => [...items].sort(compareSortDate(sortDirection)), [items, sortDirection])
  const paginatedItems = paginateItems(pageState, itemsPerPage, sortedItems)
  const showPagination = items.length > itemsPerPage

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortDirection(e.target.value as 'asc' | 'desc')
  }

  const SortablePaginatedListHeading: React.FC<ISortablePaginatedListHeadingProps> = (props) => {
    if (props.itemsLength > 0) {
      return (
        <HStack justify="space-between">
          <Heading size="xsmall" level="3">
            Viser {props.paginatedItemsLength} av {props.itemsLength} {props.itemTypeName}
          </Heading>
          <Select label="Sorter etter" hideLabel size="small" onChange={props.handleSort}>
            <option value="desc">Nyeste først</option>
            <option value="asc">Eldste først</option>
          </Select>
        </HStack>
      )
    }

    return (
      <Heading size="xsmall" level="3">
        Du har ingen {props.itemTypeName} knyttet til saken din
      </Heading>
    )
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
          <li key={index}>{renderItemAction(item, index)}</li>
        ))}
      </ul>
      {showPagination && (
        <Pagination
          className={styles.pagination}
          prevNextTexts={true}
          page={pageState}
          onPageChange={setPageState}
          count={Math.ceil(items.length / itemsPerPage)}
          boundaryCount={1}
          siblingCount={1}
        />
      )}
    </>
  )
}
