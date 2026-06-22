export default function Divider({ style: styleProp }: { style?: React.CSSProperties }) {
  return <span style={{ borderBottom: '1px solid var(--ax-border-neutral-subtleA)', ...styleProp }} />
}
