export const getDocumentProxyLink = (journalpostId: string, dokumentInfoId: string, pid?: string) => {
  const proxyLink = `/pensjon/selvbetjening/saksoversikt/api/${journalpostId}/${dokumentInfoId}`
  if (pid) return `${proxyLink}?pid=${pid}`
  return proxyLink
}
