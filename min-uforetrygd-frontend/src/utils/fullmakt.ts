type FullmaktOptions = {
  /** Show warning modal when clicked */
  warning?: boolean
}

type FullmaktProps = Record<string, true>

export function getFullmaktProps(options: FullmaktOptions | boolean = false): FullmaktProps {
  // Handle backward compatibility with boolean parameter
  const opts: FullmaktOptions = typeof options === 'boolean' ? { warning: options } : options

  const props: FullmaktProps = {}

  if (opts.warning) {
    props['data-fullmakt-modal'] = true
  }

  return props
}
