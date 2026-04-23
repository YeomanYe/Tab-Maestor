import { useState, useRef, useEffect } from 'react';
import { Language, getCurrentLanguage, setLanguage } from '@/utils/i18n';
import styles from './LanguageSwitcher.module.scss';

const languageOptions: { value: Language; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'zh', label: '中文' },
];

export const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState<Language>(getCurrentLanguage());
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setCurrentLang(lang);
    setIsOpen(false);
    // Force re-render to update translations
    window.location.reload();
  };

  const currentOption = languageOptions.find((opt) => opt.value === currentLang);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Language settings"
        aria-expanded={isOpen}
      >
        <span className={styles.icon}>🌐</span>
        <span className={styles.label}>{currentOption?.label}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {languageOptions.map((option) => (
            <button
              key={option.value}
              className={`${styles.option} ${currentLang === option.value ? styles.selected : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              <span className={styles.optionLabel}>{option.label}</span>
              {currentLang === option.value && <span className={styles.checkmark}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
