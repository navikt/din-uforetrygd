import { Button, Modal } from '@navikt/ds-react'
import React from 'react'

interface IFullmaktModal {
  onAccept: () => void
  modalRef: React.RefObject<HTMLDialogElement>
}

const FullmaktModal: React.FC<IFullmaktModal> = ({ onAccept, modalRef }) => {
  return (
    <Modal ref={modalRef} header={{ heading: 'Du går nå til en side hvor du ikke kan bruke fullmakt' }}>
      <Modal.Body>
        På siden du nå går til vil du ikke kunne handle på vegne av andre. Du vil representere deg selv når du kommer
        til denne siden. Vil du gå videre som deg selv?
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => modalRef?.current?.close()} variant="primary">
          Nei
        </Button>
        <Button variant="secondary" onClick={onAccept}>
          Ja
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default FullmaktModal
