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
          <svg width="16" height="16" viewBox="0 0 476.258 476.258" fill="currentColor">
            <path d="M476.235,119.133L357.158,0L206.936,134.654c-19.906-7.082-39.446-10.666-58.205-10.666 
              c-31.648,0-58.709,10.364-78.259,29.972l-10.574,10.607l115.305,115.298L0.023,455.045l21.213,21.213l175.18-175.181 
              l115.325,115.318l10.606-10.614c16.936-16.948,27.105-39.913,29.41-66.414c1.905-21.911-1.6-45.947-10.156-70.022L476.235,119.133z 
               M434.942,120.257L323.736,244.33l-91.784-91.811L356.025,41.303L434.942,120.257z M310.52,372.75L103.519,165.76 
              c12.401-7.74,27.764-11.773,45.212-11.773c16.56,0,34.831,3.715,53.014,10.748l109.781,109.813 
              C326.418,312.819,325.869,348.207,310.52,372.75z" 
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
