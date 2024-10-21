import clsx from "clsx";
import styles from "./linklist.module.css";

interface ILinkListProps {
  children: React.ReactNode[];
  variant?: "simple" | "divided";
}
export const LinkList: React.FC<ILinkListProps> = (props) => (
  <ul
    className={clsx(styles.linkList, {
      [styles.dividedVariant]: props.variant === "divided",
    })}
  >
    {props.children.map((child) => (
      <li
        key={child?.toString()}
        className={clsx(styles.link, {
          [styles.dividedVariantLink]: props.variant === "divided",
        })}
      >
        {child}
      </li>
    ))}
  </ul>
);
