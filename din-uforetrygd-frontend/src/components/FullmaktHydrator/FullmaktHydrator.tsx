'use client'

import { useEffect, useRef, useState } from 'react'
import { Button, Modal } from '@navikt/ds-react'
import { useRouter } from 'next/navigation'
import useIsFullmakt from '@/hooks/useIsFullmakt'

export function FullmaktHydrator() {
  const modalRef = useRef<HTMLDialogElement>(null)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const router = useRouter()
  const isFullmakt = useIsFullmakt()

  useEffect(() => {
    // Only add event listener if checkClientFullmakt is true
    if (!isFullmakt) return

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest<HTMLAnchorElement>('a[data-fullmakt-modal]')
      if (!link) return

      // allow normal browser behaviors
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return

      e.preventDefault()
      setPendingUrl(link.href)
      modalRef.current?.showModal()
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [isFullmakt])

  const close = () => {
    modalRef.current?.close()
    setPendingUrl(null)
  }

  const accept = () => {
    if (pendingUrl) router.push(pendingUrl)
    close()
  }

  // Don't render modal if fullmakt is not active
  if (!isFullmakt) return null

  return (
    <Modal ref={modalRef} header={{ heading: 'Du går nå til en side hvor du ikke kan bruke fullmakt' }} onClose={close}>
      <Modal.Body>
        På siden du nå går til vil du ikke kunne handle på vegne av andre. Du vil representere deg selv når du kommer
        til denne siden. Vil du gå videre som deg selv?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={close}>
          Nei
        </Button>
        <Button variant="secondary" onClick={accept}>
          Ja
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

// Simple utility function to get fullmakt props
export function getFullmaktProps(showWarning = false) {
  return showWarning ? { 'data-fullmakt-modal': true } : {}
}
