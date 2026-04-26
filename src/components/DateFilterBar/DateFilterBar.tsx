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

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      tabStore.setEndDateFilter(null);
      return;
    }
    // Create timestamp from date input (start of day in local timezone)
    const date = new Date(value);
    const timestamp = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();
    tabStore.setEndDateFilter(timestamp);
  };

  const handleClearFilter = () => {
    tabStore.setDateFilter(null);
    tabStore.setEndDateFilter(null);
  };

  const formatDateForInput = (timestamp: number | null): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    // Use local timezone to format date as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get max date for start date (end date if exists)
  const getStartDateMax = (): string => {
    if (!tabStore.endDateFilter) return '';
    return formatDateForInput(tabStore.endDateFilter);
  };

  // Get min date for end date (start date if exists)
  const getEndDateMin = (): string => {
    if (!tabStore.dateFilter) return '';
    return formatDateForInput(tabStore.dateFilter);
  };

  const hasActiveFilter = tabStore.dateFilter !== null;

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
            max={getStartDateMax()}
          />
          <span className={styles.timeSeparator}>{t('dateTo')}</span>
          <input
            type="date"
            className={styles.dateInput}
            value={formatDateForInput(tabStore.endDateFilter)}
            onChange={handleEndDateChange}
            placeholder={t('dateFilterPlaceholder')}
            min={getEndDateMin()}
          />
          {hasActiveFilter && (
            <button className={styles.clearButton} onClick={handleClearFilter}>
              {t('dateFilterAll')}
            </button>
          )}
          {!hasActiveFilter && tabStore.dateFilter === null && (
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
