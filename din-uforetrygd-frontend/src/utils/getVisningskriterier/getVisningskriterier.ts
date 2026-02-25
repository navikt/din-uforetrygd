import type { components } from '@/api/api'
import { Visningskriterier } from '@/const'

export const getVisningskriterier = (init: components['schemas']['UforetrygdResponse']) => {
	const sak = init.sak
	const visningskriterier: Visningskriterier[] = []

	if (!sak || sak.status === 'OPPRETTET') return [Visningskriterier.IngenUforesak]

	if (init.hasIverksattVedtak) {
		if (init.uforevedtak?.uforegrad !== 100) {
			visningskriterier.push(Visningskriterier.GradertUfore)
		}
		visningskriterier.push(Visningskriterier.Uforetrygd)
	} else if (sak.status === 'LOPENDE') {
		visningskriterier.push(Visningskriterier.Uforetrygd)
	}

	if (sak.status === 'AVSLUTTET') {
		visningskriterier.push(Visningskriterier.AvsluttetUforetrygdSak)
	}

	if (sak.status === 'TIL_BEHANDLING') {
		visningskriterier.push(Visningskriterier.SakTilBehandling)
	}

	return visningskriterier
}
