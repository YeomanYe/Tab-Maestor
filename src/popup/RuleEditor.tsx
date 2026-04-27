import { useState } from 'react';
import { SaveRule } from '@/types';
import styles from './RuleEditor.module.scss';

interface RuleEditorProps {
  rule: SaveRule;
  onSave: (rule: SaveRule) => void;
  onCancel: () => void;
}

const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

const RuleEditor = ({ rule, onSave, onCancel }: RuleEditorProps) => {
  const [domain, setDomain] = useState(rule.domain);
  const [days, setDays] = useState<number[]>(rule.days);
  const [startTime, setStartTime] = useState(rule.startTime);
  const [endTime, setEndTime] = useState(rule.endTime);

  const handleDayToggle = (day: number) => {
    // Toggle day selection - add if not selected, remove if selected
    if (days.includes(day)) {
      setDays(days.filter(d => d !== day).sort());
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
        <label className={styles.label}>网站域名</label>
        <input
          type="text"
          className={styles.input}
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com 或 *.example.com"
        />
        <span className={styles.hint}>支持通配符 * 匹配子域名</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>生效日期</label>
        <div className={styles.quickSelect}>
          <button
            type="button"
            className={`${styles.quickButton} ${days.length === 7 ? styles.active : ''}`}
            onClick={handleSelectAllDays}
          >
            每天
          </button>
          <button
            type="button"
            className={styles.quickButton}
            onClick={handleSelectWeekdays}
          >
            工作日
          </button>
          <button
            type="button"
            className={styles.quickButton}
            onClick={handleSelectWeekends}
          >
            周末
          </button>
        </div>
        <div className={styles.daySelector}>
          {dayNames.map((name, index) => (
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
        <label className={styles.label}>生效时间段</label>
        <div className={styles.timeRow}>
          <input
            type="time"
            className={styles.timeInput}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <span className={styles.timeSeparator}>至</span>
          <input
            type="time"
            className={styles.timeInput}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.button} ${styles.secondary}`}
          onClick={onCancel}
        >
          取消
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.primary}`}
          onClick={handleSave}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20,6 9,17 4,12" />
          </svg>
          保存规则
        </button>
      </div>
    </div>
  );
};

export default RuleEditor;
