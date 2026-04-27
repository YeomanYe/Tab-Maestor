import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import { getTabGroupKey, getGroupLabel } from '@/utils/date';
import { t, getCurrentLanguage } from '@/utils/i18n';
import TabCard from '../TabCard/TabCard';
import EmptyState from '../EmptyState/EmptyState';
import styles from './TabList.module.scss';

interface GroupedTabs {
  [key: string]: typeof tabStore.tabs;
}

const Pinned_TABS_GROUP_KEY = 'pinned';

const TabList = observer(() => {
  if (tabStore.isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  const isEmpty = tabStore.filteredTabs.length === 0;

  if (isEmpty) {
    return <EmptyState />;
  }

  // Separate pinned and unpinned tabs
  const pinnedTabs = tabStore.filteredTabs.filter((tab) => tab.pinned);
  const unpinnedTabs = tabStore.filteredTabs.filter((tab) => !tab.pinned);

  // Group unpinned tabs by day
  const groupedTabs: GroupedTabs = unpinnedTabs.reduce((acc, tab) => {
    const key = getTabGroupKey(tab.savedAt);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(tab);
    return acc;
  }, {} as GroupedTabs);

  // Order: today first, then yesterday, then older dates
  const groupOrder = ['today', 'yesterday'];
  const sortedGroups = Object.keys(groupedTabs).sort((a, b) => {
    if (groupOrder.includes(a) && groupOrder.includes(b)) {
      return groupOrder.indexOf(a) - groupOrder.indexOf(b);
    }
    if (groupOrder.includes(a)) return -1;
    if (groupOrder.includes(b)) return 1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Render group actions
  const renderGroupActions = (groupKey: string, showPinAction = true) => (
    <div className={styles.groupActions}>
      {showPinAction && (
        <button
          className={styles.groupActionButton}
          onClick={() => tabStore.pinAllTabsInGroup(groupKey)}
          title={t('pinAllTabs')}
        >
          <svg width="18" height="18" viewBox="0 0 476.258 476.258" fill="currentColor">
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
        className={styles.groupActionButton}
        onClick={() => tabStore.openAllTabsInGroup(groupKey)}
        title={t('openAllTabs')}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="15 3 21 3 21 9"
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
        className={`${styles.groupActionButton} ${styles.danger}`}
        onClick={() => {
          const lang = getCurrentLanguage();
          const confirmMessage = lang === 'zh'
            ? `确定要清除 ${getGroupLabel(groupKey)} 的所有标签页吗？`
            : `Clear all tabs from ${getGroupLabel(groupKey)}?`;
          if (window.confirm(confirmMessage)) {
            tabStore.deleteTabsByGroup(groupKey);
          }
        }}
        title={t('clearGroup')}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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

  // Render pinned group actions
  const renderPinnedGroupActions = () => (
    <div className={styles.groupActions}>
      <button
        className={styles.groupActionButton}
        onClick={() => tabStore.openPinnedTabs()}
        title={t('openAllTabs')}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="15 3 21 3 21 9"
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
        className={`${styles.groupActionButton} ${styles.danger}`}
        onClick={() => {
          const lang = getCurrentLanguage();
          const confirmMessage = lang === 'zh'
            ? '确定要删除所有固定的标签页吗？'
            : 'Delete all pinned tabs?';
          if (window.confirm(confirmMessage)) {
            tabStore.deletePinnedTabs();
          }
        }}
        title={t('deleteAllPinned')}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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

  return (
    <div className={styles.list}>
      {/* Pinned tabs group */}
      {pinnedTabs.length > 0 && (
        <div key={Pinned_TABS_GROUP_KEY} className={styles.group}>
          <div className={styles.groupHeader}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className={styles.groupTitle}>{t('pinnedTabs')}</span>
              <span className={styles.groupCount}>({pinnedTabs.length})</span>
            </div>
            {renderPinnedGroupActions()}
          </div>
          <div className={styles.groupContent}>
            {pinnedTabs.map((tab) => (
              <TabCard key={tab.id} tab={tab} showPinButton={false} />
            ))}
          </div>
        </div>
      )}

      {/* Regular grouped tabs */}
      {sortedGroups.map((groupKey) => (
        <div key={groupKey} className={styles.group}>
          <div className={styles.groupHeader}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className={styles.groupTitle}>{getGroupLabel(groupKey)}</span>
              <span className={styles.groupCount}>({groupedTabs[groupKey].length})</span>
            </div>
            {renderGroupActions(groupKey)}
          </div>
          <div className={styles.groupContent}>
            {groupedTabs[groupKey].map((tab) => (
              <TabCard key={tab.id} tab={tab} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

export default TabList;
