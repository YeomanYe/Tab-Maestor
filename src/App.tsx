import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import Header from '@/components/Header/Header';
import TabList from '@/components/TabList/TabList';
import Toast from '@/components/Toast/Toast';
import styles from './App.module.scss';

const App = observer(() => {
  useEffect(() => {
    tabStore.loadTabs();
  }, []);

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <TabList />
      </main>
      <Toast />
    </div>
  );
});

export default App;
