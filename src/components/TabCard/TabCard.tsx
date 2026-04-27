import { SavedTab } from '@/types';
import { tabStore } from '@/stores/TabStore';
import { formatTabTime } from '@/utils/date';
import { t } from '@/utils/i18n';
import styles from './TabCard.module.scss';

interface TabCardProps {
  tab: SavedTab;
  showPinButton?: boolean;
}

const TabCard = ({ tab, showPinButton = true }: TabCardProps) => {
  const handleClick = async () => {
    await tabStore.openAndDeleteTab(tab.id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await tabStore.deleteTab(tab.id);
  };

  const handlePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await tabStore.togglePinTab(tab.id);
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
    <div className={`${styles.card} ${tab.pinned ? styles.pinned : ''}`} onClick={handleClick}>
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

      {showPinButton && (
        <button
          className={`${styles.pinButton} ${tab.pinned ? styles.pinned : ''}`}
          onClick={handlePin}
          title={tab.pinned ? t('unpinTab') : t('pinTab')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={tab.pinned ? 'currentColor' : 'none'}>
            <path
              d="M12 2C12.55 2 13 2.45 13 3V10L18 15V21C18 21.55 17.55 22 17 22H7C6.45 22 6 21.55 6 21V15L11 10V3C11 2.45 11.45 2 12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <button
        className={`${styles.deleteButton}`}
        onClick={handleDelete}
        title={t('deleteTab')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <polyline
            points="3,6 5,6 21,6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default TabCard;
