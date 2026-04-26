import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import { ThemeSwitcher } from '@/components/ThemeSwitcher/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import SearchBox from '@/components/SearchBox/SearchBox';
import { t } from '@/utils/i18n';
import styles from './Header.module.scss';

const PRESET_OPTIONS = [
  { value: null, label: t('autoSaveDisabled') },
  { value: 15, label: '15 ' + t('autoSaveMinutes') },
  { value: 30, label: '30 ' + t('autoSaveMinutes') },
  { value: 60, label: '60 ' + t('autoSaveMinutes') },
  { value: 120, label: '120 ' + t('autoSaveMinutes') },
];

const Header = observer(() => {
  const handleSaveAll = async () => {
    await tabStore.saveAllTabs();
  };

  const handleClearAll = async () => {
    if (window.confirm(t('clearAllConfirm'))) {
      await tabStore.clearAll();
    }
  };

  const handleAutoSaveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      tabStore.setAutoSaveHours(null);
    } else {
      tabStore.setAutoSaveHours(parseInt(value, 10));
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="14" rx="2" />
              <path d="M7 8h10" strokeLinecap="round" />
              <path d="M12 12v4" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className={styles.title}>{t('appTitle')}</h1>
          {tabStore.tabCount > 0 && (
            <span className={styles.badge}>{tabStore.tabCount}</span>
          )}
        </div>
      </div>

      <div className={styles.centerSection}>
        <SearchBox />
      </div>

      <div className={styles.rightSection}>
        <div className={styles.autoSave}>
          <span className={styles.autoSaveLabel}>{t('autoSave')}</span>
          <select
            className={styles.autoSaveSelect}
            value={tabStore.autoSaveHours ?? ''}
            onChange={handleAutoSaveChange}
          >
            {PRESET_OPTIONS.map((option) => (
              <option key={option.value ?? 'disabled'} value={option.value ?? ''}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.buttonPrimary}
            onClick={handleSaveAll}
            disabled={tabStore.isLoading}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <polyline points="17,21 17,13 7,13 7,21" />
              <polyline points="7,3 7,8 15,8" />
            </svg>
            {t('saveAllTabs')}
          </button>

          {tabStore.tabCount > 0 && (
            <button className={styles.buttonDanger} onClick={handleClearAll}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              {t('clearAllTabs')}
            </button>
          )}
        </div>

        <div className={styles.switchers}>
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
});

export default Header;
