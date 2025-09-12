import {Visningskriterier} from '@/const'
import {components} from '@/api/api'

export const getVisningskriterier = (init: components['schemas']['UforetrygdResponse']) => {
  const saker = init.saker!
  const visningskriterier = saker
    .filter((sak) => sak.type === 'UFORETRYGD')
    .reduce((acc: Visningskriterier[], sak) => {
      if (init.hasIverksattVedtak) {
        if (init.uforevedtak?.uforegrad !== 100) {
          acc.push(Visningskriterier.GradertUfore)
        }
        acc.push(Visningskriterier.Uforetrygd)
      } else if (sak.status === 'LOPENDE') {
        acc.push(Visningskriterier.Uforetrygd)
      }
      if (sak.status === 'TIL_BEHANDLING') {
        acc.push(Visningskriterier.SakTilBehandling)
      }
      if (sak.status === 'AVSLUTTET') {
        acc.push(Visningskriterier.AvsluttetUforetrygdSak)
      }
      return acc
    }, [])
  return visningskriterier.length > 0 ? visningskriterier : [Visningskriterier.IngenUforesak]
}
