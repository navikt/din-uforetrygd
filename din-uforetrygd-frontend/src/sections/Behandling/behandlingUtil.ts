import { components } from '@/api/api'


export interface ForsideBehandling {
  type: string,
  status: string,
  tittel: string,
  statusTekst: string
}

export function toForsideBehandling(fra: components['schemas']['ForsideBehandling']): ForsideBehandling {
  return {
    type: fra.type,
    status: fra.status,
    tittel: lagTittel(fra.type),
    statusTekst: lagStatus(fra.status)
  }
}

export function lagTittel(type: string): string {
  switch (type) {
    case "SØKNAD_UFØRETRYGD":
      return "Søknad om uføretrygd";
    default:
      return "";
  }
}

export function lagStatus(status: string): string {
  switch (status) {
    case 'MOTTATT':
      return 'Søknad mottatt'
    case 'INNVILGET':
      return 'Søknad innvilget'
    case 'AVSLAG':
      return 'Søknad avslått'
    default:
      console.error('Ukjent status ' + status)
      return ''
  }}