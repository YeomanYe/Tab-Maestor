import { useState } from 'react';
import { SaveRule } from '@/types';
import { t } from '@/utils/i18n';
import styles from './RuleEditor.module.scss';

interface RuleEditorProps {
  rule: SaveRule;
  onSave: (rule: SaveRule) => void;
  onCancel: () => void;
}

const getDayNames = () => {
  return [
    t('daySun'),
    t('dayMon'),
    t('dayTue'),
    t('dayWed'),
    t('dayThu'),
    t('dayFri'),
    t('daySat')
  ];
};

const RuleEditor = ({ rule, onSave, onCancel }: RuleEditorProps) => {
  const [domain, setDomain] = useState(rule.domain);
  const [days, setDays] = useState<number[]>(rule.days);
  const [startTime, setStartTime] = useState(rule.startTime);
  const [endTime, setEndTime] = useState(rule.endTime);

  // Update start time with validation
  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    // If start time is after end time, update end time to be same as start time
    if (value > endTime) {
      setEndTime(value);
    }
  };

  // Update end time with validation
  const handleEndTimeChange = (value: string) => {
    setEndTime(value);
    // If end time is before start time, update start time to be same as end time
    if (value < startTime) {
      setStartTime(value);
    }
  };

  const handleDayToggle = (day: number) => {
    // Toggle day selection - add if not selected, remove if selected
    // But don't allow removing the last selected day
    if (days.includes(day)) {
      if (days.length > 1) {
        setDays(days.filter(d => d !== day).sort());
      } else {
        // Show alert when trying to remove the last day
        alert(t('atLeastOneDay'));
      }
    } else {
      setDays([...days, day].sort());
    }
  };

  const handleSelectAllDays = () => {
    // Only set to all days if not already selected - never deselect
    if (days.length !== 7) {
      setDays([0, 1, 2, 3, 4, 5, 6]);
    }
  };

  const handleSelectWeekdays = () => {
    setDays([1, 2, 3, 4, 5]);
  };

  const handleSelectWeekends = () => {
    setDays([0, 6]);
  };

  const handleSave = () => {
    onSave({
      ...rule,
      domain,
      days,
      startTime: startTime || '00:00',
      endTime: endTime || '23:59',
    });
  };

  return (
    <div className={styles.editor}>
      <div className={styles.field}>
        <label className={styles.label}>{t('domain')}</label>
        <input
          type="text"
          className={styles.input}
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com 或 *.example.com"
        />
        <span className={styles.hint}>{t('domainHint')}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t('effectiveDays')}</label>
        <div className={styles.quickSelect}>
          <button
            type="button"
            className={`${styles.quickButton} ${days.length === 7 ? styles.active : ''}`}
            onClick={handleSelectAllDays}
          >
            {t('everyDay')}
          </button>
          <button
            type="button"
            className={`${styles.quickButton} ${JSON.stringify(days) === JSON.stringify([1, 2, 3, 4, 5]) ? styles.active : ''}`}
            onClick={handleSelectWeekdays}
          >
            {t('weekdays')}
          </button>
          <button
            type="button"
            className={`${styles.quickButton} ${JSON.stringify(days) === JSON.stringify([0, 6]) ? styles.active : ''}`}
            onClick={handleSelectWeekends}
          >
            {t('weekends')}
          </button>
        </div>
        <div className={styles.daySelector}>
          {getDayNames().map((name, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dayButton} ${days.includes(index) ? styles.active : ''}`}
              onClick={() => handleDayToggle(index)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t('effectiveTime')}</label>
        <div className={styles.timeRow}>
          <input
            type="time"
            className={styles.timeInput}
            value={startTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
          />
          <span className={styles.timeSeparator}>{t('dateTo')}</span>
          <input
            type="time"
            className={styles.timeInput}
            value={endTime}
            onChange={(e) => handleEndTimeChange(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.button} ${styles.secondary}`}
          onClick={onCancel}
        >
          {t('cancel')}
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.primary}`}
          onClick={handleSave}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20,6 9,17 4,12" />
          </svg>
          {t('saveRule')}
        </button>
      </div>
    </div>
  );
};

export default RuleEditor;
