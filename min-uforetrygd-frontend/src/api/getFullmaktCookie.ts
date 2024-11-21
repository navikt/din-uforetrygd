import { cookies } from 'next/headers'

// Hent fullmaktscookie dersom dennes finnes
export const getFullmaktCookie = async () => {
  const cookie = await cookies()
  const fullmaktCookie = cookie.get('nav-obo')
  if (!fullmaktCookie) return undefined

  const parsedCookie = `${fullmaktCookie.name}=${fullmaktCookie.value}`
  return parsedCookie
}
