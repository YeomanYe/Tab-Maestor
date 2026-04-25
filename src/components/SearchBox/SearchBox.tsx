import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import { t } from '@/utils/i18n';
import styles from './SearchBox.module.scss';

const SearchBox = observer(() => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    tabStore.setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    tabStore.setSearchQuery('');
  };

  return (
    <div className={styles.container}>
      <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        className={styles.input}
        placeholder={t('searchPlaceholder') || 'Search tabs...'}
        value={tabStore.searchQuery}
        onChange={handleSearch}
      />
      {tabStore.searchQuery && (
        <button className={styles.clearButton} onClick={handleClear} title="Clear search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
});

export default SearchBox;
