
export function getTilleggsoppsummeringTekst(
  hasGjenlevendeTillegg: boolean,
  hasBarnetilleggFellesBarn: boolean,
  hasBarnetilleggSaerkullsbarn: boolean): string {

  let tilleggsoppsummering: string = ''

  if (hasGjenlevendeTillegg) {
    tilleggsoppsummering += 'gjenlevendetillegg'
  }

  if (hasBarnetilleggSaerkullsbarn) {
    if (tilleggsoppsummering.length === 0) {
      tilleggsoppsummering += 'barnetillegg for særkullsbarn'
    } else {
      tilleggsoppsummering += ', barnetillegg for særkullsbarn'
    }
  }

  if (hasBarnetilleggFellesBarn) {
    if (tilleggsoppsummering.length === 0) {
      tilleggsoppsummering += 'barnetillegg for fellesbarn'
    } else {
      tilleggsoppsummering += ', barnetillegg for fellesbarn'
    }
  }

  return tilleggsoppsummering ? tilleggsoppsummering : 'Ingen'
}