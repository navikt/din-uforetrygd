const checkClientFullmakt = () => {
  const cookies = document.cookie.split(';').reduce(
    (cookies, cookie) => {
      const [name, value] = cookie.split('=').map((c) => c.trim())
      cookies[name] = value
      return cookies
    },
    {} as Record<string, string>
  )
  return Object.keys(cookies).includes('nav-obo')
}

export default checkClientFullmakt
