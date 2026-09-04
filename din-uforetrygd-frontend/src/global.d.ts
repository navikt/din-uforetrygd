declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.css' {}

declare module '*.svg' {
  const source: import('next/image').StaticImageData
  export default source
}

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      'representasjon-banner': CustomElement<{
        representasjonstyper?: string
        redirectTo: string
        style: React.CSSProperties
      }>
    }
  }
}
