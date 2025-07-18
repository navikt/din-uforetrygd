import { describe, expect, it } from 'vitest'
import { readableFileSize } from './utils'

describe('readableFileSize', () => {
  it('returns "0 kB" for 0 input', () => {
    expect(readableFileSize(0)).toBe('0 kB')
  })

  it('returns size in kB for input less than 1 MB', () => {
    expect(readableFileSize(1024)).toBe('1.00 kB')
    expect(readableFileSize(2048)).toBe('2.00 kB')
  })

  it('returns size in MB for input greater than 1 MB', () => {
    expect(readableFileSize(1048577)).toBe('1.00 MB')
    expect(readableFileSize(2097152)).toBe('2.00 MB')
  })

  it('handles fractional kB sizes correctly', () => {
    expect(readableFileSize(1536)).toBe('1.50 kB')
  })
})
