import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import styles from './Toast.module.scss';

const Toast = observer(() => {
  if (!tabStore.toast) return null;

  return (
    <div className={`${styles.toast} ${styles[tabStore.toast.type]}`}>
      {tabStore.toast.type === 'success' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="22,4 12,14.01 9,11.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <line
            x1="12"
            y1="8"
            x2="12"
            y2="12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="12"
            y1="16"
            x2="12.01"
            y2="16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
      <span>{tabStore.toast.message}</span>
    </div>
  );
});

export default Toast;
