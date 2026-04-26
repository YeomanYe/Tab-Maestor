import { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import { t } from '@/utils/i18n';
import styles from './AutoSaveSetting.module.scss';

// Options in minutes
const PRESET_OPTIONS: Array<{ value: number | null; label: string }> = [
  { value: null, label: t('autoSaveDisabled') },
  { value: 15, label: '15' },
  { value: 30, label: '30' },
  { value: 45, label: '45' },
  { value: 60, label: '60' },
  { value: 90, label: '90' },
  { value: 120, label: '120' },
];

const AutoSaveSetting = observer(() => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync value when store changes
  useEffect(() => {
    if (tabStore.autoSaveHours !== null) {
      setValue(String(tabStore.autoSaveHours));
    } else {
      setValue('');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    const minutes = parseInt(newValue, 10);
    if (!isNaN(minutes) && minutes > 0) {
      tabStore.setAutoSaveHours(minutes);
    } else if (newValue === '') {
      tabStore.setAutoSaveHours(null);
    }
  };

  const handleFocus = () => {
    // Show dropdown on focus
    if (inputRef.current) {
      inputRef.current.showPicker?.();
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{t('autoSave')}</label>
      <div className={styles.wrapper}>
        <input
          ref={inputRef}
          type="number"
          className={styles.input}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={t('autoSaveMinutes')}
          min="1"
          list="auto-save-presets"
        />
        <span className={styles.unit}>{t('autoSaveMinutes')}</span>
        <datalist id="auto-save-presets">
          {PRESET_OPTIONS.filter(o => o.value !== null).map((option) => (
            <option key={option.value} value={String(option.value)} />
          ))}
        </datalist>
      </div>
    </div>
  );
});

export default AutoSaveSetting;
