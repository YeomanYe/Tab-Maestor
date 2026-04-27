import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { tabStore } from '@/stores/TabStore';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header/Header';
import TabList from '@/components/TabList/TabList';
import Toast from '@/components/Toast/Toast';
import DateFilterBar from '@/components/DateFilterBar/DateFilterBar';
import styles from './App.module.scss';

const AppContent = observer(() => {
  useEffect(() => {
    tabStore.loadTabs();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        tabStore.loadTabs();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <TabList />
      </main>
      <DateFilterBar />
      <Toast />
    </div>
  );
});

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
