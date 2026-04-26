import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import { t } from '@/utils/i18n';
import styles from './AutoSaveSetting.module.scss';

const HOUR_OPTIONS = [
  { value: null, label: t('autoSaveDisabled') },
  { value: 1, label: `1 ${t('autoSaveHours')}` },
  { value: 6, label: `6 ${t('autoSaveHours')}` },
  { value: 12, label: `12 ${t('autoSaveHours')}` },
  { value: 24, label: `24 ${t('autoSaveHours')}` },
  { value: 48, label: `48 ${t('autoSaveHours')}` },
  { value: 72, label: `72 ${t('autoSaveHours')}` },
  { value: 168, label: `168 ${t('autoSaveHours')}` }, // 1 week
];

const AutoSaveSetting = observer(() => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const hours = value === '' ? null : parseInt(value, 10);
    tabStore.setAutoSaveHours(hours);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{t('autoSave')}</label>
      <select
        className={styles.select}
        value={tabStore.autoSaveHours ?? ''}
        onChange={handleChange}
      >
        {HOUR_OPTIONS.map((option) => (
          <option key={option.value ?? 'disabled'} value={option.value ?? ''}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

export default AutoSaveSetting;
