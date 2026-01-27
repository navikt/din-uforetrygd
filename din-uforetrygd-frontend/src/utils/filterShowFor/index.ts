import { Visningskriterier } from '@/const'

type ShowForData = {
  showFor: ((visningskriterier: Visningskriterier[]) => boolean) | boolean
}

const filterShowFor = <T extends ShowForData>(visningskriterier: Visningskriterier[], data: T[]): T[] => {
  return data.filter(({ showFor }) => {
    if (typeof showFor === 'boolean') {
      return showFor
    }

    return showFor(visningskriterier)
  })
}

export const matchAll = (showFor: Visningskriterier[]) => (visningskriterier: Visningskriterier[]) =>
  showFor.every((kriterie) => visningskriterier.includes(kriterie))

export const matchSome = (showFor: Visningskriterier[]) => (visningskriterier: Visningskriterier[]) =>
  showFor.some((kriterie) => visningskriterier.includes(kriterie))

export const matchNone = (showFor: Visningskriterier[]) => (visningskriterier: Visningskriterier[]) =>
  !showFor.some((kriterie) => visningskriterier.includes(kriterie))

export default filterShowFor
