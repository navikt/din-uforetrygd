import { describe, expect, it } from 'vitest'
import { compareSortDate, paginateItems } from '@/components/SortablePaginatedList/utils'

describe('compareSortDate', () => {
  it('should compare items in list to return for descending order', () => {
    const items = [
      { sortDate: '2020-01-01T00:00:00' },
      { sortDate: '2020-01-02T00:00:00' },
      { sortDate: '2019-01-01T00:00:00' },
    ]
    const sortedDescending = [...items].sort(compareSortDate('desc'))
    expect(sortedDescending).toEqual([
      { sortDate: '2020-01-02T00:00:00' },
      { sortDate: '2020-01-01T00:00:00' },
      { sortDate: '2019-01-01T00:00:00' },
    ])
  })

  it('should compare items in list to return for ascending order', () => {
    const items = [
      { sortDate: '2020-01-01T00:00:00' },
      { sortDate: '2020-01-02T00:00:00' },
      { sortDate: '2019-01-01T00:00:00' },
    ]
    const sortedAscending = [...items].sort(compareSortDate('asc'))
    expect(sortedAscending).toEqual([
      { sortDate: '2019-01-01T00:00:00' },
      { sortDate: '2020-01-01T00:00:00' },
      { sortDate: '2020-01-02T00:00:00' },
    ])
  })

  it('should compare items with same date and different timestamp in list to return for descending order', () => {
    const items = [
      { sortDate: '2020-01-01T00:00:02' },
      { sortDate: '2020-01-01T00:00:00' },
      { sortDate: '2020-01-01T00:00:01' },
    ]
    const sortedDescending = [...items].sort(compareSortDate('desc'))
    expect(sortedDescending).toEqual([
      { sortDate: '2020-01-01T00:00:02' },
      { sortDate: '2020-01-01T00:00:01' },
      { sortDate: '2020-01-01T00:00:00' },
    ])
  })

  it('should compare items with same date and different timestamp in list to return for ascending order', () => {
    const items = [
      { sortDate: '2020-01-01T00:00:02' },
      { sortDate: '2020-01-01T00:00:00' },
      { sortDate: '2020-01-01T00:00:01' },
    ]
    const sortedAscending = [...items].sort(compareSortDate('asc'))
    expect(sortedAscending).toEqual([
      { sortDate: '2020-01-01T00:00:00' },
      { sortDate: '2020-01-01T00:00:01' },
      { sortDate: '2020-01-01T00:00:02' },
    ])
  })
})

describe('paginateItems', () => {
  it('should return a list of the first two elements when paginated for the first page and two items per page', () => {
    const items = [
      { sortDate: '2020-01-01T00:00:00' },
      { sortDate: '2020-01-02T00:00:00' },
      { sortDate: '2019-01-01T00:00:00' },
    ]
    const paginatedItems = paginateItems(1, 2, items)
    expect(paginatedItems).toEqual([{ sortDate: '2020-01-01T00:00:00' }, { sortDate: '2020-01-02T00:00:00' }])
  })

  it('should return a list of the last element when paginated for the second page and two items per page', () => {
    const items = [
      { sortDate: '2020-01-01T00:00:00' },
      { sortDate: '2020-01-02T00:00:00' },
      { sortDate: '2019-01-01T00:00:00' },
    ]
    const paginatedItems = paginateItems(2, 2, items)
    expect(paginatedItems).toEqual([{ sortDate: '2019-01-01T00:00:00' }])
  })
})
