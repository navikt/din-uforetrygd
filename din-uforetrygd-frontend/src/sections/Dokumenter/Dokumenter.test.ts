import { describe, expect, it } from 'vitest'
import { getDocumentProxyLink } from './utils'

describe('getDocumentProxyLink', () => {
  it('returns proxy link without pid when pid is undefined', () => {
    const result = getDocumentProxyLink('123', '456')
    expect(result).toBe('/pensjon/selvbetjening/saksoversikt/api/123/456')
  })

  it('returns proxy link with pid when pid is provided', () => {
    const result = getDocumentProxyLink('123', '456', '789')
    expect(result).toBe('/pensjon/selvbetjening/saksoversikt/api/123/456?pid=789')
  })

  it('returns proxy link without pid when pid is an empty string', () => {
    const result = getDocumentProxyLink('123', '456', '')
    expect(result).toBe('/pensjon/selvbetjening/saksoversikt/api/123/456')
  })
})
