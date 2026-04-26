import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import { t } from '@/utils/i18n';
import styles from './AutoSaveSetting.module.scss';

const AutoSaveSetting = observer(() => {
  const [value, setValue] = useState('');

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

  return (
    <div className={styles.container}>
      <label className={styles.label}>{t('autoSave')}</label>
      <div className={styles.wrapper}>
        <input
          type="number"
          className={styles.input}
          value={value}
          onChange={handleChange}
          placeholder={t('autoSaveMinutes')}
          min="1"
        />
      </div>
    </div>
  );
});

export default AutoSaveSetting;
