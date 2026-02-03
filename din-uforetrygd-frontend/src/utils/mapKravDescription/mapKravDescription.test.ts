import { describe, expect, it } from 'vitest'
import { mapKravDescription } from './mapKravDescription'

describe('mapKravDescription', () => {
  it('returns correct description for valid kravGjelder and kravArsak', () => {
    expect(mapKravDescription('AFP_EO', 'OMGJ_ETTER_ANKE', 'alderspensjon')).toBe(
      'AFP etteroppgjør omgjøring etter anke'
    )
  })

  it('returns default description when kravArsak is not found', () => {
    expect(mapKravDescription('AFP_EO', 'UNKNOWN_ARSAK', 'alderspensjon')).toBe('AFP etteroppgjør')
  })

  it('returns correct description for string mapping kravGjelder', () => {
    expect(mapKravDescription('EKSPORT', '', 'alderspensjon')).toBe('Eksport av alderspensjon')
  })

  it('returns empty string when kravGjelder is not found', () => {
    expect(mapKravDescription('UNKNOWN_KRAV', 'OMGJ_ETTER_ANKE', 'alderspensjon')).toBe('')
  })

  it('handles nested mappings with default fallback', () => {
    expect(mapKravDescription('ETTERGIV_GJELD', 'UNKNOWN_ARSAK', 'alderspensjon')).toBe('Ettergivelse av gjeld')
  })

  it('returns correct description for dynamic sakstype in nested mappings', () => {
    expect(mapKravDescription('FORSTEG_BH', 'NY_SOKNAD', 'alderspensjon')).toBe('Søknad om alderspensjon - ny søknad')
  })

  it('returns default description for nested mapping when kravArsak is missing', () => {
    expect(mapKravDescription('SOK_UU', 'UNKNOWN_ARSAK', 'alderspensjon')).toBe('Søknad om ung ufør')
  })

  it('returns correct description for kravGjelder with no kravArsak', () => {
    expect(mapKravDescription('ENDR_UTTAKSGRAD', '', 'alderspensjon')).toBe('Endring av uttaksgrad')
  })

  it('returns empty string when both kravGjelder and kravArsak are empty', () => {
    expect(mapKravDescription('', '', 'alderspensjon')).toBe('')
  })
})
