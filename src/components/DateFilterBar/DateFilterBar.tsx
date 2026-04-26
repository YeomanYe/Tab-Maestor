import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import { t } from '@/utils/i18n';
import styles from './DateFilterBar.module.scss';

const DateFilterBar = observer(() => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      tabStore.setDateFilter(null);
      return;
    }
    // Create timestamp from date input (start of day in local timezone)
    const date = new Date(value);
    const timestamp = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();
    tabStore.setDateFilter(timestamp);
  };

  const handleClearFilter = () => {
    tabStore.setDateFilter(null);
  };

  const formatDateForInput = (timestamp: number | null): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterRow}>
        <label className={styles.label}>{t('dateFilter')}</label>
        <div className={styles.controls}>
          <input
            type="date"
            className={styles.dateInput}
            value={formatDateForInput(tabStore.dateFilter)}
            onChange={handleDateChange}
            placeholder={t('dateFilterPlaceholder')}
          />
          {tabStore.dateFilter && (
            <button className={styles.clearButton} onClick={handleClearFilter}>
              {t('dateFilterAll')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default DateFilterBar;
