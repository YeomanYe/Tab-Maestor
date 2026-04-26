import { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import { t } from '@/utils/i18n';
import styles from './AutoSaveSetting.module.scss';

// Options in minutes
const PRESET_OPTIONS: Array<{ value: number | null; label: string }> = [
  { value: null, label: 'Disabled' },
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

const AutoSaveSetting = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: number | null) => {
    tabStore.setAutoSaveHours(value);
    setIsOpen(false);
  };

  const currentOption = PRESET_OPTIONS.find(opt => opt.value === tabStore.autoSaveHours);
  const currentLabel = currentOption?.value === null ? t('autoSaveDisabled') : currentOption?.label || '';

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <svg className={styles.labelIcon} viewBox="0 0 24 24" fill="none">
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        {t('autoSave')}
      </label>

      <div className={styles.selector} ref={containerRef}>
        <button
          className={`${styles.trigger} ${isOpen ? styles.active : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <span className={`${styles.triggerValue} ${tabStore.autoSaveHours === null ? styles.triggerValueDisabled : ''}`}>
            {currentLabel}
          </span>
          <svg className={styles.chevron} viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {isOpen && (
          <div className={styles.dropdown}>
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
                    {option.value === null ? t('autoSaveDisabled') : option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default AutoSaveSetting;
