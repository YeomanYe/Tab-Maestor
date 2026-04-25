import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { SaveRule } from '@/types';
import { getRules, saveRules, createDefaultRule, toWildcardDomain } from '@/utils/rulesStorage';
import RuleEditor from './RuleEditor';
import styles from './Popup.module.scss';

const Popup = observer(() => {
  const [rules, setRules] = useState<SaveRule[]>([]);
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [editingRule, setEditingRule] = useState<SaveRule | null>(null);

  useEffect(() => {
    loadRules();
    getCurrentTabDomain();
  }, []);

  const loadRules = async () => {
    const loadedRules = await getRules();
    setRules(loadedRules);
  };

  const getCurrentTabDomain = async () => {
    try {
      const tabs = await chrome?.tabs?.query({ active: true, currentWindow: true });
      if (!tabs || tabs.length === 0) return;
      const tab = tabs[0];
      if (tab?.url) {
        try {
          const url = new URL(tab.url);
          const wildcardDomain = toWildcardDomain(url.hostname);
          setCurrentDomain(wildcardDomain);
          // Open add rule interface by default when domain is loaded
          setEditingRule(createDefaultRule(wildcardDomain || 'example.com'));
        } catch {
          // Ignore invalid URLs
        }
      }
    } catch {
      // Ignore errors
    }
  };

  useEffect(() => {
    loadRules();
    getCurrentTabDomain();
  }, []);

  const handleAddRule = () => {
    const newRule = createDefaultRule(currentDomain || 'example.com');
    setEditingRule(newRule);
  };

  const handleEditRule = (rule: SaveRule) => {
    setEditingRule(rule);
  };

  const handleDeleteRule = async (id: string) => {
    const newRules = rules.filter((r) => r.id !== id);
    await saveRules(newRules);
    setRules(newRules);
  };

  const handleToggleRule = async (id: string) => {
    const newRules = rules.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    await saveRules(newRules);
    setRules(newRules);
  };

  const handleSaveRule = async (rule: SaveRule) => {
    const existingIndex = rules.findIndex((r) => r.id === rule.id);
    let newRules: SaveRule[];

    if (existingIndex >= 0) {
      newRules = rules.map((r, i) => (i === existingIndex ? rule : r));
    } else {
      newRules = [...rules, rule];
    }

    await saveRules(newRules);
    setRules(newRules);
    setEditingRule(null);
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
  };

  const formatTime = (rule: SaveRule): string => {
    if (rule.days.length === 0) {
      if (rule.startTime === '00:00' && rule.endTime === '23:59') {
        return '每天 全天';
      }
      return `每天 ${rule.startTime}-${rule.endTime}`;
    }

    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const days = rule.days.map((d) => dayNames[d]).join('、');
    return `${days} ${rule.startTime}-${rule.endTime}`;
  };

  return (
    <div className={styles.popup}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tab Maestro</h1>
        <button className={styles.addButton} onClick={handleAddRule}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" />
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" />
          </svg>
          添加规则
        </button>
      </div>

      {editingRule ? (
        <RuleEditor
          rule={editingRule}
          onSave={handleSaveRule}
          onCancel={handleCancelEdit}
        />
      ) : (
        <div className={styles.ruleList}>
          {rules.length === 0 ? (
            <p style={{ color: '#71717a', textAlign: 'center', padding: '20px' }}>
              暂无规则，点击添加按钮创建规则
            </p>
          ) : (
            rules.map((rule) => (
              <div key={rule.id} className={styles.ruleItem}>
                <div className={styles.ruleHeader}>
                  <span className={styles.ruleDomain}>{rule.domain}</span>
                  <div className={styles.ruleActions}>
                    <button
                      className={`${styles.toggle} ${rule.enabled ? styles.active : ''}`}
                      onClick={() => handleToggleRule(rule.id)}
                      title={rule.enabled ? '禁用' : '启用'}
                    />
                    <button
                      className={styles.iconButton}
                      onClick={() => handleEditRule(rule)}
                      title="编辑"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </button>
                    <button
                      className={`${styles.iconButton} ${styles.danger}`}
                      onClick={() => handleDeleteRule(rule.id)}
                      title="删除"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </button>
                  </div>
                </div>
                <span className={styles.ruleTime}>{formatTime(rule)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
});

export default Popup;
