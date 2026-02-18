import { SavedTab } from '@/types';
import { tabStore } from '@/stores/TabStore';
import styles from './TabCard.module.scss';

interface TabCardProps {
  tab: SavedTab;
}

const TabCard = ({ tab }: TabCardProps) => {
  const handleOpen = async () => {
    await tabStore.openTab(tab.id);
  };

  const handleDelete = async () => {
    await tabStore.deleteTab(tab.id);
  };

  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
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

  return (
    <div className={styles.card}>
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

      <div className={styles.content} onClick={handleOpen}>
        <h3 className={styles.title}>{tab.title}</h3>
        <p className={styles.url}>{getDomain(tab.url)}</p>
      </div>

      <div className={styles.meta}>
        <span className={styles.time}>{formatTime(tab.savedAt)}</span>
        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={handleOpen}
            title="Open tab"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="15,3 21,3 21,9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="10"
                y1="14"
                x2="21"
                y2="3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={handleDelete}
            title="Delete tab"
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
      </div>
    </div>
  );
};

export default TabCard;
