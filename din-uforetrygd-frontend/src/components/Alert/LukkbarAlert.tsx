'use client'

import { Alert, type AlertProps } from '@navikt/ds-react'
import type React from 'react'
import { useEffect, useState } from 'react'
import styles from './lukkbarAlert.module.css'

export const LukkbarAlert = ({
  children,
  variant,
  cookieNavn,
}: {
  children: React.ReactNode
  variant: AlertProps['variant']
  cookieNavn: string
}) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const cookies = document.cookie.split(';').map((c) => c.trim())
    const cookie = cookies.find((c) => c.startsWith(`${cookieNavn}=`))
    if (cookie && cookie.split('=')[1] === 'false') {
      // TODO Trenger vi denne?
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(false)
    }
  }, [cookieNavn])

  const handleClose = () => {
    // biome-ignore lint/suspicious/noDocumentCookie: TODO: fiks denne
    document.cookie = `${cookieNavn}=false; path=/; max-age=31536000`
    setShow(false)
  }

  if (!show) return null

  return (
    <Alert className={styles.alert} contentMaxWidth={false} variant={variant} closeButton onClose={handleClose}>
      {children}
    </Alert>
  )
}
