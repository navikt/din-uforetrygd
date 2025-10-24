export const getDocumentProxyLink = (
  journalpostId: string,
  dokumentInfoId: string,
  variantformat?: string,
  pid?: string
) => {
  const proxyLink = `/din-uforetrygd/selvbetjening/api/${journalpostId}/${dokumentInfoId}`
  // pid og variantformat er kun i bruk i veilederløsning og brukes alltid i par
  if (pid && variantformat) return `${proxyLink}?variantformat=${variantformat}&pid=${pid}`
  return proxyLink
}
