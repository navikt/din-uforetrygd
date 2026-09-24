import { Innloggingstype } from '@/const'

type InnloggingsnivaaProps = Record<string, true>

export function showMinIdModal(innloggingstype: Innloggingstype, visInnloggingsModal: boolean): InnloggingsnivaaProps {
  const modalProperties: InnloggingsnivaaProps = {}
  if (innloggingstype === Innloggingstype.LEVEL3 && visInnloggingsModal) {
    modalProperties['data-innloggingstype'] = true
  }
  return modalProperties
}
