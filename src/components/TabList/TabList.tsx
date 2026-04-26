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

  return (
    <div className={styles.list}>
      {/* Pinned tabs group */}
      {pinnedTabs.length > 0 && (
        <div key={Pinned_TABS_GROUP_KEY} className={styles.group}>
          <div className={styles.groupHeader}>
            <span className={styles.groupTitle}>{t('pinnedTabs')}</span>
            <span className={styles.groupCount}>({pinnedTabs.length})</span>
          </div>
          <div className={styles.groupContent}>
            {pinnedTabs.map((tab) => (
              <TabCard key={tab.id} tab={tab} />
            ))}
          </div>
        </div>
      )}

      {/* Regular grouped tabs */}
      {sortedGroups.map((groupKey) => (
        <div key={groupKey} className={styles.group}>
          <div className={styles.groupHeader}>
            <span className={styles.groupTitle}>{getGroupLabel(groupKey)}</span>
            <button
              className={styles.clearGroupButton}
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
