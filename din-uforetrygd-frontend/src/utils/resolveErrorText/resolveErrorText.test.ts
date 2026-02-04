import { describe, expect, it } from 'vitest'
import { resolveErrorText } from '@/utils/resolveErrorText/resolveErrorText'

describe('resolveErrorText', () => {
  it("should return 'Du må logge inn med et høyere sikkerhetsnivå for å få tilgang til denne siden. Du kan for eksempel bruke BankID.' when type is 'LOGIN_LEVEL_TOO_LOW'", () => {
    const result = resolveErrorText('LOGIN_LEVEL_TOO_LOW')
    expect(result).toBe(
      'Du må logge inn med et høyere sikkerhetsnivå for å få tilgang til denne siden. Du kan for eksempel bruke BankID.'
    )
  })

  it("should return 'Du har ikke tilgang til denne siden.' when type is 'VEILEDER_UNAUTHORIZED'", () => {
    const result = resolveErrorText('VEILEDER_UNAUTHORIZED')
    expect(result).toBe('Du har ikke tilgang til denne siden.')
  })

  it("should return 'Du har ikke tilgang til denne siden.' when type is 'NO_FULLMAKT_PRESENT'", () => {
    const result = resolveErrorText('NO_FULLMAKT_PRESENT')
    expect(result).toBe('Du har ikke tilgang til denne siden.')
  })

  it("should return 'Noe gikk galt. Prøv igjen senere' when type is not recognized", () => {
    const result = resolveErrorText('UNRECOGNIZED_TYPE')
    expect(result).toBe('Noe gikk galt. Prøv igjen senere')
  })

  it("should return 'Noe gikk galt. Prøv igjen senere' when type is an empty string", () => {
    const result = resolveErrorText('')
    expect(result).toBe('Noe gikk galt. Prøv igjen senere')
  })

  it("should return 'Noe gikk galt. Prøv igjen senere' when type is undefined", () => {
    const result = resolveErrorText(undefined)
    expect(result).toBe('Noe gikk galt. Prøv igjen senere')
  })
})
