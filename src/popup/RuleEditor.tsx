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
    if (days.includes(day)) {
      setDays(days.filter((d) => d !== day));
    } else {
      setDays([...days, day].sort());
    }
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
        <label className={styles.label}>域名</label>
        <input
          type="text"
          className={styles.input}
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com 或 *.example.com"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>日期（留空表示每天）</label>
        <div className={styles.daySelector}>
          {dayNames.map((name, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dayButton} ${days.includes(index) ? styles.active : ''}`}
              onClick={() => handleDayToggle(index)}
            >
              周{name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>时间段</label>
        <div className={styles.timeRow}>
          <input
            type="time"
            className={styles.timeInput}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <span className={styles.timeSeparator}>-</span>
          <input
            type="time"
            className={styles.timeInput}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={`${styles.button} ${styles.secondary}`} onClick={onCancel}>
          取消
        </button>
        <button type="button" className={`${styles.button} ${styles.primary}`} onClick={handleSave}>
          保存
        </button>
      </div>
    </div>
  );
};

export default RuleEditor;
