import { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import { ThemeSwitcher } from '@/components/ThemeSwitcher/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import SearchBox from '@/components/SearchBox/SearchBox';
import { t } from '@/utils/i18n';
import styles from './Header.module.scss';

// Options in minutes
const PRESET_OPTIONS: Array<{ value: number | null; label: string }> = [
  { value: null, label: t('autoSaveDisabled') },
  { value: 15, label: '15 ' + t('autoSaveMinutes') },
  { value: 30, label: '30 ' + t('autoSaveMinutes') },
  { value: 45, label: '45 ' + t('autoSaveMinutes') },
  { value: 60, label: '60 ' + t('autoSaveMinutes') },
  { value: 90, label: '90 ' + t('autoSaveMinutes') },
  { value: 120, label: '120 ' + t('autoSaveMinutes') },
];

const Header = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if current value is a custom value (not in presets)
  const isCustomValue = tabStore.autoSaveHours !== null &&
    !PRESET_OPTIONS.some(opt => opt.value === tabStore.autoSaveHours);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Use setTimeout to allow click events on dropdown items to fire first
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownClick = (e: React.MouseEvent) => {
    // Prevent dropdown from closing when clicking inside it
    e.stopPropagation();
  };

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSaveAll = async () => {
    // Send message to background to save all tabs (same as keyboard shortcut)
    try {
      await (window.chrome as typeof window.chrome & { runtime?: { sendMessage?: (message: { action: string }) => Promise<void> } }).runtime?.sendMessage?.({ action: 'saveAllTabs' });
    } catch {
      // Silently fail if not in Chrome extension context
    }
  };

  const handleClearAll = async () => {
    if (window.confirm(t('clearAllConfirm'))) {
      await tabStore.clearAll();
    }
  };

  const handleSelect = (value: number | null) => {
    tabStore.setAutoSaveHours(value);
    setIsOpen(false);
    setCustomValue('');
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomValue(value);

    // Allow typing numbers only
    const minutes = parseInt(value, 10);
    if (!isNaN(minutes) && minutes > 0) {
      tabStore.setAutoSaveHours(minutes);
    } else if (value === '') {
      tabStore.setAutoSaveHours(null);
    }
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setIsOpen(false);
      setCustomValue('');
    }
  };

  const currentOption = PRESET_OPTIONS.find(opt => opt.value === tabStore.autoSaveHours);
  const currentLabel = isCustomValue
    ? `${tabStore.autoSaveHours} ${t('autoSaveMinutes')}`
    : currentOption?.value === null
      ? t('autoSaveDisabled')
      : currentOption?.label || '';

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" class="trae-browser-inspect-draggable"> 
              <rect x="2" y="2" width="20" height="20" rx="2"/> 
              <path d="M7 8h10" stroke-linecap="round"/> 
              <path d="M12 12v10" stroke-linecap="round"/> 
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
        <div className={styles.autoSave} ref={containerRef}>
          <span className={styles.autoSaveLabel}>{t('autoSave')}</span>
          <div className={styles.autoSaveSelector}>
            <button
              className={`${styles.autoSaveTrigger} ${isOpen ? styles.active : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              type="button"
            >
              <span className={`${styles.autoSaveValue} ${tabStore.autoSaveHours === null ? styles.disabled : ''}`}>
                {currentLabel}
              </span>
              <svg className={styles.chevron} viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {isOpen && (
              <div className={styles.dropdown} onClick={handleDropdownClick}>
                {/* Custom input field */}
                <div className={styles.customInputWrapper}>
                  <input
                    ref={inputRef}
                    type="number"
                    className={styles.customInput}
                    placeholder={t('autoSaveCustomPlaceholder')}
                    value={isCustomValue ? String(tabStore.autoSaveHours) : customValue}
                    onChange={handleCustomInput}
                    onKeyDown={handleCustomKeyDown}
                    min="1"
                  />
                  <span className={styles.customInputLabel}>{t('autoSaveMinutes')}</span>
                </div>

                <div className={styles.divider} />

                {PRESET_OPTIONS.map((option) => (
                  <button
                    key={option.value ?? 'disabled'}
                    className={`${styles.dropdownItem} ${option.value === tabStore.autoSaveHours ? styles.selected : ''}`}
                    onClick={() => handleSelect(option.value)}
                    type="button"
                  >
                    <div className={styles.dropdownItemValue}>
                      {option.value === tabStore.autoSaveHours && (
                        <span className={styles.currentIndicator} />
                      )}
                      <span className={option.value === null ? styles.disabledOption : ''}>
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
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
