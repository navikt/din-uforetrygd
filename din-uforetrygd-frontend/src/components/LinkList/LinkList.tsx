import clsx from 'clsx'
import styles from './linklist.module.css'

interface ILinkListProps {
  children: React.ReactNode | React.ReactNode[]
  variant?: 'simple' | 'divided'
}
export const LinkList: React.FC<ILinkListProps> = (props) => {
  const children = Array.isArray(props.children) ? props.children : [props.children]

  return (
    <ul
      className={clsx(styles.linkList, {
        [styles.dividedVariant]: props.variant === 'divided',
      })}
    >
      {children.map((child, index) => (
        <li
          // biome-ignore lint/suspicious/noArrayIndexKey: TODO: flytt koden utenfra inn hit
          key={index}
          className={clsx(styles.link, {
            [styles.dividedVariantLink]: props.variant === 'divided',
          })}
        >
          {child}
        </li>
      ))}
    </ul>
  )
}
