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

  const handleQuickFilter = (days: number) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    tabStore.setDateFilter(today);
    tabStore.setEndDateFilter(today + (days - 1) * 24 * 60 * 60 * 1000);
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

  const hasDateFilter = tabStore.dateFilter !== null || tabStore.endDateFilter !== null;

  return (
    <div className={styles.container}>
      <div className={styles.filterRow}>
        {/* Quick Filter Pills */}
        <div className={styles.quickFilters}>
          <button
            className={`${styles.quickButton} ${!tabStore.dateFilter && !tabStore.endDateFilter ? styles.active : ''}`}
            onClick={handleClearFilter}
          >
            {t('dateFilterAll')}
          </button>
          <button
            className={`${styles.quickButton} ${tabStore.dateFilter && tabStore.endDateFilter === tabStore.dateFilter ? styles.active : ''}`}
            onClick={() => handleQuickFilter(1)}
          >
            {t('dateToday')}
          </button>
          <button
            className={styles.quickButton}
            onClick={() => handleQuickFilter(7)}
          >
            {t('dateThisWeek')}
          </button>
          <button
            className={styles.quickButton}
            onClick={() => handleQuickFilter(30)}
          >
            {t('dateThisMonth')}
          </button>
        </div>

        {/* Date Range Input */}
        <div className={styles.dateRangeWrapper}>
          <span className={styles.dateLabel}>{t('dateRange')}</span>
          <div className={styles.dateRange}>
            <input
              type="date"
              className={styles.dateInput}
              value={formatDateForInput(tabStore.dateFilter)}
              onChange={handleDateChange}
              placeholder={t('dateFilterPlaceholder')}
              max={getStartDateMax()}
            />
            <span className={styles.separator}>→</span>
            <input
              type="date"
              className={styles.dateInput}
              value={formatDateForInput(tabStore.endDateFilter)}
              onChange={handleEndDateChange}
              placeholder={t('dateFilterPlaceholder')}
              min={getEndDateMin()}
            />
            {hasDateFilter && (
              <button
                className={styles.clearDates}
                onClick={handleClearFilter}
                title={t('clearFilter')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default DateFilterBar;
