import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import styles from './Header.module.scss';

const Header = observer(() => {
  const handleSaveCurrent = async () => {
    await tabStore.saveCurrentTab();
  };

  const handleSaveAll = async () => {
    await tabStore.saveAllTabs();
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all saved tabs?')) {
      await tabStore.clearAll();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <svg
          className={styles.logo}
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M7 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 12v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <h1 className={styles.title}>Tab Maestro</h1>
        {tabStore.tabCount > 0 && (
          <span className={styles.badge}>{tabStore.tabCount}</span>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.buttonPrimary}
          onClick={handleSaveCurrent}
          disabled={tabStore.isLoading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="17,21 17,13 7,13 7,21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 11v6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 14h6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Save Current
        </button>

        <button
          className={styles.buttonSecondary}
          onClick={handleSaveAll}
          disabled={tabStore.isLoading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect
              x="2"
              y="3"
              width="20"
              height="14"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M8 21h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Save All
        </button>

        {tabStore.tabCount > 0 && (
          <button className={styles.buttonDanger} onClick={handleClearAll}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline
                points="3,6 5,6 21,6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Clear All
          </button>
        )}
      </div>
    </header>
  );
});

export default Header;
