export const getDocumentProxyLink = (
  journalpostId: string,
  dokumentInfoId: string,
  variantformat: string,
  pid?: string
) => {
  const proxyLink = `/pensjon/selvbetjening/saksoversikt/api/${journalpostId}/${dokumentInfoId}/${variantformat}`
  if (pid) return `${proxyLink}?pid=${pid}`
  return proxyLink
}
