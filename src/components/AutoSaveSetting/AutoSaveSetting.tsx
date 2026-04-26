import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import { t } from '@/utils/i18n';
import styles from './AutoSaveSetting.module.scss';

// Options in minutes
const PRESET_OPTIONS = [
  { value: null, label: t('autoSaveDisabled') },
  { value: 15, label: '15' },
  { value: 30, label: '30' },
  { value: 45, label: '45' },
  { value: 60, label: '60' },
  { value: 90, label: '90' },
  { value: 120, label: '120' },
];

const AutoSaveSetting = observer(() => {
  const [selectValue, setSelectValue] = useState<string>('');
  const [inputValue, setInputValue] = useState('');

  // Sync values when store changes
  useEffect(() => {
    const hours = tabStore.autoSaveHours;
    if (hours !== null) {
      const isPreset = PRESET_OPTIONS.some(o => o.value === hours);
      if (isPreset) {
        setSelectValue(String(hours));
        setInputValue('');
      } else {
        setSelectValue('custom');
        setInputValue(String(hours));
      }
    } else {
      setSelectValue('');
      setInputValue('');
    }
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectValue(value);
    setInputValue('');

    if (value === '' || value === 'custom') {
      tabStore.setAutoSaveHours(null);
    } else {
      const minutes = parseInt(value, 10);
      tabStore.setAutoSaveHours(minutes);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectValue('custom');

    const minutes = parseInt(value, 10);
    if (!isNaN(minutes) && minutes > 0) {
      tabStore.setAutoSaveHours(minutes);
    } else if (value === '') {
      tabStore.setAutoSaveHours(null);
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{t('autoSave')}</label>
      <div className={styles.wrapper}>
        <select
          className={styles.select}
          value={selectValue}
          onChange={handleSelectChange}
        >
          {PRESET_OPTIONS.map((option) => (
            <option
              key={option.value ?? 'disabled'}
              value={option.value ?? ''}
            >
              {option.label}
            </option>
          ))}
          <option value="custom">{t('autoSaveCustom')}</option>
        </select>
        <input
          type="number"
          className={styles.input}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={t('autoSaveMinutes')}
          min="1"
        />
        <span className={styles.unit}>{t('autoSaveMinutes')}</span>
      </div>
    </div>
  );
});

export default AutoSaveSetting;
