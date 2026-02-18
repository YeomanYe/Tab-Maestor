import styles from './EmptyState.module.scss';

const EmptyState = () => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="2"
            y="3"
            width="20"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8 21h8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 17v4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M2 7h20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h2 className={styles.title}>No saved tabs</h2>
      <p className={styles.description}>
        Click &quot;Save Current&quot; or &quot;Save All&quot; to save your tabs for
        later.
      </p>
    </div>
  );
};

export default EmptyState;
