import { describe, expect, it } from 'vitest'
import { getTilleggsoppsummeringTekst } from './utils'

describe('getTilleggsoppsummeringTekst', () => {
  it('should return "Ingen" when all parameters are false', () => {
    const result = getTilleggsoppsummeringTekst(false, false, false)
    expect(result).toBe('-')
  })

  it('should return "gjenlevendetillegg" when only hasGjenlevendeTillegg is true', () => {
    const result = getTilleggsoppsummeringTekst(true, false, false)
    expect(result).toBe('Gjenlevendetillegg')
  })

  it('should return "barnetillegg for særkullsbarn" when only hasBarnetilleggSaerkullsbarn is true', () => {
    const result = getTilleggsoppsummeringTekst(false, false, true)
    expect(result).toBe('Barnetillegg for særkullsbarn')
  })

  it('should return "barnetillegg for fellesbarn" when only hasBarnetilleggFellesBarn is true', () => {
    const result = getTilleggsoppsummeringTekst(false, true, false)
    expect(result).toBe('Barnetillegg for fellesbarn')
  })

  it('should return comma-separated string when hasGjenlevendeTillegg and hasBarnetilleggFellesBarn are true', () => {
    const result = getTilleggsoppsummeringTekst(true, true, false)
    expect(result).toBe('Gjenlevendetillegg, barnetillegg for fellesbarn')
  })

  it('should return comma-separated string when hasGjenlevendeTillegg and hasBarnetilleggSaerkullsbarn are true', () => {
    const result = getTilleggsoppsummeringTekst(true, false, true)
    expect(result).toBe('Gjenlevendetillegg, barnetillegg for særkullsbarn')
  })

  it('should return comma-separated string when hasBarnetilleggFellesBarn and hasBarnetilleggSaerkullsbarn are true', () => {
    const result = getTilleggsoppsummeringTekst(false, true, true)
    expect(result).toBe('Barnetillegg for særkullsbarn, barnetillegg for fellesbarn')
  })

  it('should return all three benefits comma-separated when all parameters are true', () => {
    const result = getTilleggsoppsummeringTekst(true, true, true)
    expect(result).toBe('Gjenlevendetillegg, barnetillegg for særkullsbarn, barnetillegg for fellesbarn')
  })
})
