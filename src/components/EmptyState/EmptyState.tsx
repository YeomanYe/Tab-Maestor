import { getCurrentLanguage } from '@/utils/i18n';
import styles from './EmptyState.module.scss';

const EmptyState = () => {
  const lang = getCurrentLanguage();

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
      <h2 className={styles.title}>{lang === 'zh' ? '暂无保存的标签页' : 'No saved tabs'}</h2>
      <p className={styles.description}>
        {lang === 'zh'
          ? '点击"保存所有标签页"来保存并关闭您打开的标签页'
          : 'Click "Save All Tabs" to save and close your open tabs'}
      </p>
    </div>
  );
};

export default EmptyState;
