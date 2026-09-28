type InnloggingsnivaaProps = Record<string, true>

export function showMinIdModal(visInnloggingsModal: boolean): InnloggingsnivaaProps {
  const modalProperties: InnloggingsnivaaProps = {}
  if (visInnloggingsModal) {
    modalProperties['data-innloggingstype'] = true
  }
  return modalProperties
}
