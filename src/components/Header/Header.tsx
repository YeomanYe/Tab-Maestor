import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import { ThemeSwitcher } from '@/components/ThemeSwitcher/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import SearchBox from '@/components/SearchBox/SearchBox';
import { t } from '@/utils/i18n';
import styles from './Header.module.scss';

const Header = observer(() => {
  const handleSaveAll = async () => {
    await tabStore.saveAllTabs();
  };

  const handleClearAll = async () => {
    if (window.confirm(t('clearAllConfirm'))) {
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
        <h1 className={styles.title}>{t('appTitle')}</h1>
        {tabStore.tabCount > 0 && (
          <span className={styles.badge}>{tabStore.tabCount}</span>
        )}
      </div>

      <SearchBox />

      <div className={styles.actions}>
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
          {t('saveAllTabs')}
        </button>

        {tabStore.tabCount > 0 && (
          <>
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
              {t('clearAllTabs')}
            </button>
          </>
        )}

        <ThemeSwitcher />

        <LanguageSwitcher />
      </div>
    </header>
  );
});

export default Header;
