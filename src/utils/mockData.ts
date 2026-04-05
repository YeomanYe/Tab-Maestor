import { SavedTab } from '@/types';

export const mockTabs: SavedTab[] = [
  {
    id: '1',
    title: 'Google',
    url: 'https://www.google.com',
    favicon: 'https://www.google.com/favicon.ico',
    savedAt: Date.now() - 60000,
  },
  {
    id: '2',
    title: 'GitHub',
    url: 'https://github.com',
    favicon: 'https://github.com/favicon.ico',
    savedAt: Date.now() - 3600000,
  },
  {
    id: '3',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    favicon: 'https://stackoverflow.com/favicon.ico',
    savedAt: Date.now() - 86400000,
  },
  {
    id: '4',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    favicon: 'https://developer.mozilla.org/favicon.ico',
    savedAt: Date.now() - 172800000,
  },
  {
    id: '5',
    title: 'React',
    url: 'https://react.dev',
    favicon: 'https://react.dev/favicon.ico',
    savedAt: Date.now() - 259200000,
  },
];
