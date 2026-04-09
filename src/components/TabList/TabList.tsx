import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import { getTabGroupKey, getGroupLabel } from '@/utils/date';
import TabCard from '../TabCard/TabCard';
import EmptyState from '../EmptyState/EmptyState';
import styles from './TabList.module.scss';

interface GroupedTabs {
  [key: string]: typeof tabStore.tabs;
}

const TabList = observer(() => {
  if (tabStore.isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (tabStore.isEmpty) {
    return <EmptyState />;
  }

  // Group tabs by day
  const groupedTabs: GroupedTabs = tabStore.tabs.reduce((acc, tab) => {
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
      {sortedGroups.map((groupKey) => (
        <div key={groupKey} className={styles.group}>
          <div className={styles.groupHeader}>{getGroupLabel(groupKey)}</div>
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
