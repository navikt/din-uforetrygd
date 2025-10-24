import { describe, expect, it } from 'vitest'
import { getDocumentProxyLink } from './utils'

describe('getDocumentProxyLink', () => {
  it('returns proxy link without query params when none provided', () => {
    const result = getDocumentProxyLink('123', '456')
    expect(result).toBe('/din-uforetrygd/selvbetjening/api/123/456')
  })

  it('returns proxy link without pid when only pid is provided', () => {
    const result = getDocumentProxyLink('123', '456', undefined, '789')
    expect(result).toBe('/din-uforetrygd/selvbetjening/api/123/456')
  })

  it('returns proxy link without variantFormat when only variantFormat is provided', () => {
    const result = getDocumentProxyLink('123', '456', 'SLADDET', undefined)
    expect(result).toBe('/din-uforetrygd/selvbetjening/api/123/456')
  })

  it('returns proxy link with both pid and variantFormat when both are provided', () => {
    const result = getDocumentProxyLink('123', '456', 'SLADDET', '789')
    expect(result).toBe('/din-uforetrygd/selvbetjening/api/123/456?variantformat=SLADDET&pid=789')
  })

  it('returns proxy link without query params when empty strings are provided', () => {
    const result = getDocumentProxyLink('123', '456', '', '')
    expect(result).toBe('/din-uforetrygd/selvbetjening/api/123/456')
  })
})
