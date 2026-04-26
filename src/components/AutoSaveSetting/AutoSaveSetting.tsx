import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import { t } from '@/utils/i18n';
import styles from './AutoSaveSetting.module.scss';

// Options in minutes
const PRESET_OPTIONS: Array<{ value: number | string | null; label?: string; labelKey?: 'autoSaveDisabled' | 'autoSaveCustom' }> = [
  { value: null, labelKey: 'autoSaveDisabled' },
  { value: 15, label: '15' },
  { value: 30, label: '30' },
  { value: 45, label: '45' },
  { value: 60, label: '1' },
  { value: 90, label: '1.5' },
  { value: 120, label: '2' },
  { value: 'custom', labelKey: 'autoSaveCustom' },
];

const AutoSaveSetting = observer(() => {
  const [customValue, setCustomValue] = useState('');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === 'custom') {
      // Keep custom input, set store to null temporarily
      tabStore.setAutoSaveHours(null);
    } else if (value === '') {
      tabStore.setAutoSaveHours(null);
      setCustomValue('');
    } else {
      const minutes = parseInt(value, 10);
      tabStore.setAutoSaveHours(minutes);
      setCustomValue('');
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomValue(value);

    const minutes = parseInt(value, 10);
    if (!isNaN(minutes) && minutes > 0) {
      tabStore.setAutoSaveHours(minutes);
    } else if (value === '') {
      tabStore.setAutoSaveHours(null);
    }
  };

  const isCustomSelected = tabStore.autoSaveHours !== null &&
    !PRESET_OPTIONS.some(o => o.value === tabStore.autoSaveHours);

  const selectValue = isCustomSelected
    ? 'custom'
    : (tabStore.autoSaveHours ?? '');

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
              {option.labelKey ? t(option.labelKey) : `${option.label} ${t('autoSaveMinutes')}`}
            </option>
          ))}
        </select>
        {(selectValue === 'custom' || isCustomSelected) && (
          <input
            type="number"
            className={styles.input}
            value={isCustomSelected ? String(tabStore.autoSaveHours) : customValue}
            onChange={handleCustomChange}
            placeholder={t('autoSaveMinutes')}
            min="1"
          />
        )}
      </div>
    </div>
  );
});

export default AutoSaveSetting;
