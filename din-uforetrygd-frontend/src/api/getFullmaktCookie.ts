import { cookies } from 'next/headers'

// Hent fullmaktscookie dersom dennes finnes
export const getFullmaktCookie = async () => {
  const cookie = await cookies()
  const fullmaktCookie = cookie.get('nav-obo')

  if (!fullmaktCookie) {
    if (process.env.NODE_ENV === 'development') {
      return `nav-obo=${process.env.LOCAL_PID}`
    }
    return undefined
  }
  return `${fullmaktCookie.name}=${fullmaktCookie.value}`
}
