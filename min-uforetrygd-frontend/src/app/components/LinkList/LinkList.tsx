import styles from "./linklist.module.css";

interface ILinkListProps {
  children: React.ReactNode[];
}
export const LinkList: React.FC<ILinkListProps> = (props) => (
  <ul className={styles.linkList}>
    {props.children.map((child) => (
      <li key={child?.toString()} className={styles.link}>
        {child}
      </li>
    ))}
  </ul>
);
