import { ISortableItem } from './SortablePaginatedList'

export const compareSortDate =
  (sortDirection: 'asc' | 'desc') =>
  <T extends ISortableItem>(a: T, b: T) => {
    if (sortDirection === 'asc') {
      return a.sortDate.localeCompare(b.sortDate)
    }
    return b.sortDate.localeCompare(a.sortDate)
  }

export const paginateItems = <T>(pageState: number, itemsPerPage: number, sortedItems: T[]) => {
  const startIndex = (pageState - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return sortedItems.slice(startIndex, endIndex)
}
