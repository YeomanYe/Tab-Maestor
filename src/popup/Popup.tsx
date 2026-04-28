import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { SaveRule } from '@/types';
import { getRules, saveRules, createDefaultRule, toWildcardDomain } from '@/utils/rulesStorage';
import { t } from '@/utils/i18n';
import RuleEditor from './RuleEditor';
import styles from './Popup.module.scss';
import browser from 'webextension-polyfill';

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
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (!tabs || tabs.length === 0) return;
      const tab = tabs[0];
      if (tab?.url) {
        try {
          const url = new URL(tab.url);
          const wildcardDomain = toWildcardDomain(url.hostname);
          setCurrentDomain(wildcardDomain);
          // Set default to rule editor with current domain
          const newRule = createDefaultRule(wildcardDomain || 'example.com');
          setEditingRule(newRule);
        } catch {
          // Ignore invalid URLs
        }
      }
    } catch {
      // Ignore errors
    }
  };

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

  const getFullDayNames = () => {
    return [
      t('fullDaySun'),
      t('fullDayMon'),
      t('fullDayTue'),
      t('fullDayWed'),
      t('fullDayThu'),
      t('fullDayFri'),
      t('fullDaySat')
    ];
  };

  const formatTime = (rule: SaveRule): string => {
    // Check for preset day combinations
    const isEveryDay = rule.days.length === 7;
    const isWeekdays = JSON.stringify(rule.days) === JSON.stringify([1, 2, 3, 4, 5]);
    const isWeekends = JSON.stringify(rule.days) === JSON.stringify([0, 6]);

    let dayText = '';
    if (isEveryDay) {
      dayText = t('everyDay');
    } else if (isWeekdays) {
      dayText = t('weekdays');
    } else if (isWeekends) {
      dayText = t('weekends');
    } else {
      // For custom day combinations
      const dayNames = getFullDayNames();
      dayText = rule.days.map((d) => dayNames[d]).join('、');
    }

    // Always show time range
    return `${dayText} ${rule.startTime} - ${rule.endTime}`;
  };

  return (
    <div className={styles.popup}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" className="trae-browser-inspect-draggable">
              <rect x="2" y="2" width="20" height="20" rx="2"/>
              <path d="M7 8h10" stroke-linecap="round"/>
              <path d="M12 12v10" stroke-linecap="round"/>
            </svg>
          </div>
          <h1 className={styles.title}>{t('appTitle')}</h1>
        </div>
        <button className={styles.addButton} onClick={handleAddRule}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t('addRule')}
        </button>
      </div>

      {editingRule ? (
        <RuleEditor
          rule={editingRule}
          onSave={handleSaveRule}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          <div className={styles.ruleList}>
            {rules.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className={styles.emptyTitle}>{t('noRules')}</p>
              <p className={styles.emptyDesc}>
                {t('noRulesDescription')}
              </p>
            </div>
          ) : (
              rules.map((rule) => (
                <div key={rule.id} className={styles.ruleCard}>
                  <div className={styles.ruleHeader}>
                    <span className={`${styles.ruleDomain} ${!rule.enabled ? styles.disabled : ''}`}>
                    {rule.domain}
                  </span>
                    <div className={styles.ruleActions}>
                      <button
                        className={`${styles.toggle} ${rule.enabled ? styles.active : ''}`}
                        onClick={() => handleToggleRule(rule.id)}
                        title={rule.enabled ? t('disable') : t('enable')}
                      />
                      <button
                        className={styles.iconButton}
                        onClick={() => handleEditRule(rule)}
                        title={t('edit')}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className={`${styles.iconButton} ${styles.danger}`}
                        onClick={() => handleDeleteRule(rule.id)}
                        title={t('delete')}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <span className={styles.ruleTime}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                    {formatTime(rule)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className={styles.footer}>
            <button className={styles.openFullButton} onClick={() => {
              if (browser.runtime?.openOptionsPage) {
                browser.runtime.openOptionsPage();
              } else {
                window.open('index.html', '_blank');
              }
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15,3 21,3 21,9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {t('openTabManager')}
            </button>
          </div>
        </>
      )}
    </div>
  );
});

export default Popup;
