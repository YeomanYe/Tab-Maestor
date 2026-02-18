import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import TabCard from '../TabCard/TabCard';
import EmptyState from '../EmptyState/EmptyState';
import styles from './TabList.module.scss';

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

  return (
    <div className={styles.list}>
      {tabStore.tabs.map((tab) => (
        <TabCard key={tab.id} tab={tab} />
      ))}
    </div>
  );
});

export default TabList;
