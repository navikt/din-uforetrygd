import { Innloggingstype } from '@/const'

type InnloggingsnivaaProps = Record<string, true>

export function showModal(innloggingstype: Innloggingstype, visInnloggingsModal: boolean): InnloggingsnivaaProps {
  const modalProperties: InnloggingsnivaaProps = {}
  if ((innloggingstype as Innloggingstype) === Innloggingstype.LEVEL3 && visInnloggingsModal) {
    modalProperties['data-innloggingstype'] = true
  }
  return modalProperties
}
