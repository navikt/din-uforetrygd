
export function getTilleggsoppsummeringTekst(
  hasGjenlevendeTillegg: boolean,
  hasBarnetilleggFellesBarn: boolean,
  hasBarnetilleggSaerkullsbarn: boolean): string {
    const parts: string[] = []
    if (hasGjenlevendeTillegg) parts.push('gjenlevendetillegg')
    if (hasBarnetilleggSaerkullsbarn) parts.push('barnetillegg for særkullsbarn')
    if (hasBarnetilleggFellesBarn) parts.push('barnetillegg for fellesbarn')

    if (parts.length === 0) return '-'

    const result = parts.join(', ')
    return result.charAt(0).toUpperCase() + result.slice(1)
  }

export function getManedligBeregnetYtelseTekst(
  hasGjenlevendeTillegg: boolean,
  hasBarnetillegg: boolean
): string {
  return 'Månedlig beregnet uføretrygd'.concat(
    hasBarnetillegg && hasGjenlevendeTillegg
      ? ', barne- og gjenlevendetillegg'
      : hasBarnetillegg
        ? ' og barnetillegg'
        : hasGjenlevendeTillegg
          ? ' og gjenlevendetillegg'
          : ''
  );
}