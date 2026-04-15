import { SavedTab } from '@/types';
import { tabStore } from '@/stores/TabStore';
import { formatTabTime } from '@/utils/date';
import styles from './TabCard.module.scss';

interface TabCardProps {
  tab: SavedTab;
}

const TabCard = ({ tab }: TabCardProps) => {
  const handleClick = async () => {
    await tabStore.openAndDeleteTab(tab.id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await tabStore.deleteTab(tab.id);
  };

  const getDefaultFavicon = (): string => {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    `)}`;
  };

  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return '';
    }
  };

  const domain = getDomain(tab.url);

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.favicon}>
        <img
          src={tab.favicon || getDefaultFavicon()}
          alt=""
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getDefaultFavicon();
          }}
        />
      </div>

      <span className={styles.title}>
        {tab.title}
        {domain && <span className={styles.domain}> ({domain})</span>}
      </span>

      <span className={styles.time}>{formatTabTime(tab.savedAt)}</span>

      <button
        className={`${styles.deleteButton}`}
        onClick={handleDelete}
        title="Delete tab"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <line
            x1="18"
            y1="6"
            x2="6"
            y2="18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default TabCard;
