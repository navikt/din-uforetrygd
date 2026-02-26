import { useEffect, useState } from 'react'

const useIsFullmakt = () => {
  const [fullmakt, setFullmakt] = useState(false)

  useEffect(() => {
    const cookies = document.cookie.split(';').reduce(
      (cookies, cookie) => {
        const [name, value] = cookie.split('=').map((c) => c.trim())
        cookies[name] = value
        return cookies
      },
      {} as Record<string, string>
    )
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFullmakt(Object.keys(cookies).includes('nav-obo'))
  }, [])
  return fullmakt
}

export default useIsFullmakt
