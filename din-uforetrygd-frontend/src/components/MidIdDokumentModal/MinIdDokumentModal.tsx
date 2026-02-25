'use client'

import { BodyLong, Button, HStack, Modal, VStack } from '@navikt/ds-react'
import { useEffect, useRef, useState } from 'react'
import { Innloggingstype } from '@/const'

interface MinIdDokumentarkivModalProps {
	innloggingstype?: Innloggingstype
}

export const MinIdDokumentModal: React.FC<MinIdDokumentarkivModalProps> = ({ innloggingstype }) => {
	const modalRef = useRef<HTMLDialogElement>(null)
	const [pendingUrl, setPendingUrl] = useState<string | null>(null)

	useEffect(() => {
		if (innloggingstype !== Innloggingstype.LEVEL3) return

		const onClick = (e: MouseEvent) => {
			const link = (e.target as HTMLElement)?.closest<HTMLAnchorElement>('a[data-innloggingstype]')
			if (!link) return

			if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return

			e.preventDefault()
			setPendingUrl(link.href)
			modalRef.current?.showModal()
		}

		document.addEventListener('click', onClick)
		return () => document.removeEventListener('click', onClick)
	}, [])

	const close = () => {
		modalRef.current?.close()
	}

	return (
		<Modal
			ref={modalRef}
			onClose={close}
			aria-label="For lavt innloggingsnivå"
			header={{ heading: 'For lavt innloggingsnivå' }}
		>
			<Modal.Body>
				<VStack gap="space-24">
					<BodyLong>
						Du er logget inn med MinID. For å komme inn på Dokumenter må du logge inn med et høyere sikkerhetsnivå, for
						eksempel BankID.
					</BodyLong>
					<BodyLong>
						Du kan se dokumenter knyttet til uføretrygd i saksoversikten her i Din uføretrygd med nåværende innlogging.
					</BodyLong>
					<HStack marginBlock="space-16 space-0" justify="space-between">
						<Button onClick={close} variant="secondary">
							Avbryt
						</Button>
						<Button as="a" href={pendingUrl!} variant="primary" onClick={close}>
							Logg inn med høyere sikkerhetsnivå
						</Button>
					</HStack>
				</VStack>
			</Modal.Body>
		</Modal>
	)
}
