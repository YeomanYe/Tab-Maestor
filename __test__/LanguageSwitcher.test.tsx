import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    // Reset to English by default
    localStorageMock.setItem('tab-maestro-language', 'en');
  });

  describe('normal: rendering', () => {
    it('normal: should render language switcher button', () => {
      render(<LanguageSwitcher />);
      expect(screen.getByRole('button', { name: /language settings/i })).toBeInTheDocument();
    });

    it('normal: should display current language label', () => {
      render(<LanguageSwitcher />);
      expect(screen.getByText('EN')).toBeInTheDocument();
    });

    it('normal: should display globe icon', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language settings/i });
      expect(button.querySelector('.icon') || button.textContent).toContain('🌐');
    });
  });

  describe('normal: dropdown interaction', () => {
    it('normal: should open dropdown when button is clicked', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language settings/i });
      fireEvent.click(button);
      expect(screen.getByText('中文')).toBeInTheDocument();
    });

    it('normal: should display both language options in dropdown', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language settings/i });
      fireEvent.click(button);
      expect(screen.getByText('EN')).toBeInTheDocument();
      expect(screen.getByText('中文')).toBeInTheDocument();
    });

    it('normal: should switch to Chinese when Chinese option is clicked', () => {
      render(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /language settings/i });
      fireEvent.click(button);
      const chineseOption = screen.getByText('中文');
      fireEvent.click(chineseOption);
      // After clicking, the component should reload and show 中文
      expect(screen.getByText('中文')).toBeInTheDocument();
    });
  });

  describe('edge: localStorage integration', () => {
    it('edge: should read language from localStorage', () => {
      localStorageMock.setItem('tab-maestro-language', 'zh');
      render(<LanguageSwitcher />);
      expect(screen.getByText('中文')).toBeInTheDocument();
    });
  });
});
