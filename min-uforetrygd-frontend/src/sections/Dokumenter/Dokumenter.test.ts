import { describe, expect, it } from 'vitest'
import { getDocumentProxyLink } from './utils'

describe('getDocumentProxyLink', () => {
  it('returns proxy link without pid when pid is undefined', () => {
    const result = getDocumentProxyLink('123', '456', 'ARKIV')
    expect(result).toBe('/uforetrygd/selvbetjening/api/123/456/ARKIV')
  })

  it('returns proxy link with pid when pid is provided', () => {
    const result = getDocumentProxyLink('123', '456', 'ARKIV', '789')
    expect(result).toBe('/uforetrygd/selvbetjening/api/123/456/ARKIV?pid=789')
  })

  it('returns proxy link without pid when pid is an empty string', () => {
    const result = getDocumentProxyLink('123', '456', 'ARKIV')
    expect(result).toBe('/uforetrygd/selvbetjening/api/123/456/ARKIV')
  })
})
