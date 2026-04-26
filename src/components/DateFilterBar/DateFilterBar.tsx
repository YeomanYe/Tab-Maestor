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

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      tabStore.setStartTimeFilter(null);
      return;
    }
    const [hours, minutes] = value.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    tabStore.setStartTimeFilter(totalMinutes);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      tabStore.setEndTimeFilter(null);
      return;
    }
    const [hours, minutes] = value.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    tabStore.setEndTimeFilter(totalMinutes);
  };

  const handleClearFilter = () => {
    tabStore.setDateFilter(null);
    tabStore.setStartTimeFilter(null);
    tabStore.setEndTimeFilter(null);
  };

  const formatDateForInput = (timestamp: number | null): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  };

  const formatTimeForInput = (minutes: number | null): string => {
    if (minutes === null) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
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
          />
          {hasActiveFilter && (
            <>
              <span className={styles.timeSeparator}>{t('timeFrom')}</span>
              <input
                type="time"
                className={styles.timeInput}
                value={formatTimeForInput(tabStore.startTimeFilter)}
                onChange={handleStartTimeChange}
                placeholder={t('timeStartPlaceholder')}
              />
              <span className={styles.timeSeparator}>{t('timeTo')}</span>
              <input
                type="time"
                className={styles.timeInput}
                value={formatTimeForInput(tabStore.endTimeFilter)}
                onChange={handleEndTimeChange}
                placeholder={t('timeEndPlaceholder')}
              />
              <button className={styles.clearButton} onClick={handleClearFilter}>
                {t('dateFilterAll')}
              </button>
            </>
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
