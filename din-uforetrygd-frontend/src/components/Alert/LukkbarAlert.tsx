'use client'

import React, { useEffect, useState } from 'react'
import { Alert, AlertProps } from '@navikt/ds-react'

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
      setShow(false)
    }
  }, [])

  const handleClose = () => {
    document.cookie = `${cookieNavn}=false; path=/; max-age=31536000`
    setShow(false)
  }

  if (!show) return null

  return (
    <Alert style={{maxWidth: 'var(--content-width)'}} contentMaxWidth={false} variant={variant} closeButton onClose={handleClose}>
      {children}
    </Alert>
  )
}
