import { describe, expect, it } from 'vitest'
import { formatInntekt } from './formatter'

describe('formatInntekt', () => {
  it('should return an empty string for null input', () => {
    expect(formatInntekt(null)).toBe('')
  })

  it('should return an empty string for undefined input', () => {
    expect(formatInntekt(undefined)).toBe('')
  })

  it('should return an empty string for empty string input', () => {
    expect(formatInntekt('')).toBe('')
  })

  it('should format a number input correctly', () => {
    expect(formatInntekt(123456)).toBe('123 456')
  })

  it('should format a string input correctly', () => {
    expect(formatInntekt('123456')).toBe('123 456')
  })

  it('should return an empty string for invalid string input', () => {
    expect(formatInntekt('abc')).toBe('')
  })
})
