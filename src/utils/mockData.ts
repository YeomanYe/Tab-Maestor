import { SavedTab } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Sample websites for mock data
const websites = [
  { name: 'Google', url: 'https://www.google.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
  { name: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
  { name: 'React', url: 'https://react.dev' },
  { name: 'Vue', url: 'https://vuejs.org' },
  { name: 'Angular', url: 'https://angular.io' },
  { name: 'Svelte', url: 'https://svelte.dev' },
  { name: 'TypeScript', url: 'https://www.typescriptlang.org' },
  { name: 'Node.js', url: 'https://nodejs.org' },
  { name: 'Vite', url: 'https://vitejs.dev' },
  { name: 'Webpack', url: 'https://webpack.js.org' },
  { name: 'Babel', url: 'https://babeljs.io' },
  { name: 'ESLint', url: 'https://eslint.org' },
  { name: 'Prettier', url: 'https://prettier.io' },
  { name: 'Docker', url: 'https://www.docker.com' },
  { name: 'Kubernetes', url: 'https://kubernetes.io' },
  { name: 'AWS', url: 'https://aws.amazon.com' },
  { name: 'Firebase', url: 'https://firebase.google.com' },
  { name: 'Supabase', url: 'https://supabase.com' },
  { name: 'Prisma', url: 'https://www.prisma.io' },
  { name: 'GraphQL', url: 'https://graphql.org' },
  { name: 'Apollo', url: 'https://www.apollographql.com' },
  { name: 'Redux', url: 'https://redux.js.org' },
  { name: 'MobX', url: 'https://mobx.js.org' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
  { name: 'Bootstrap', url: 'https://getbootstrap.com' },
  { name: 'Material UI', url: 'https://mui.com' },
  { name: 'Chakra UI', url: 'https://chakra-ui.com' },
  { name: 'Figma', url: 'https://www.figma.com' },
  { name: 'Notion', url: 'https://www.notion.so' },
  { name: 'Slack', url: 'https://slack.com' },
  { name: 'Discord', url: 'https://discord.com' },
  { name: 'Zoom', url: 'https://zoom.us' },
  { name: 'Jira', url: 'https://www.atlassian.com/software/jira' },
  { name: 'Confluence', url: 'https://www.atlassian.com/software/confluence' },
  { name: 'Reddit', url: 'https://www.reddit.com' },
  { name: 'Twitter', url: 'https://twitter.com' },
  { name: 'YouTube', url: 'https://www.youtube.com' },
  { name: 'Netflix', url: 'https://www.netflix.com' },
  { name: 'Amazon', url: 'https://www.amazon.com' },
  { name: 'Wikipedia', url: 'https://en.wikipedia.org' },
  { name: 'Medium', url: 'https://medium.com' },
  { name: 'Dev.to', url: 'https://dev.to' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com' },
  { name: 'Product Hunt', url: 'https://www.producthunt.com' },
  { name: 'Dribbble', url: 'https://dribbble.com' },
  { name: 'Behance', url: 'https://www.behance.net' },
  { name: 'CodePen', url: 'https://codepen.io' },
  { name: 'JSFiddle', url: 'https://jsfiddle.net' },
  { name: 'Replit', url: 'https://replit.com' },
];

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const now = new Date();

// Calculate timestamps for different time periods
// Today: from midnight to now (distribute 40 items)
const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
const todayEnd = now.getTime();

// Yesterday: full day (distribute 40 items)
const yesterdayStart = todayStart - MILLISECONDS_PER_DAY;
const yesterdayEnd = todayStart;

// Last 7 days (excluding today and yesterday): 7 days (distribute 40 items)
const lastWeekStart = todayStart - 7 * MILLISECONDS_PER_DAY;
const lastWeekEnd = yesterdayStart;

// Last 30 days (excluding last 7 days): 23 days (distribute 40 items)
const lastMonthStart = todayStart - 30 * MILLISECONDS_PER_DAY;
const lastMonthEnd = lastWeekStart;

// Last 90 days (excluding last 30 days): 60 days (distribute 40 items)
const lastQuarterStart = todayStart - 90 * MILLISECONDS_PER_DAY;
const lastQuarterEnd = lastMonthStart;

// Generate random timestamp within range
const randomTimestamp = (start: number, end: number): number => {
  return start + Math.floor(Math.random() * (end - start));
};

// Generate mock tabs
const generateMockTabs = (): SavedTab[] => {
  const tabs: SavedTab[] = [];
  const itemsPerPeriod = 40;

  // Generate tabs for each time period
  for (let i = 0; i < itemsPerPeriod; i++) {
    const website = websites[i % websites.length];

    // Today
    tabs.push({
      id: uuidv4(),
      title: website.name,
      url: website.url,
      favicon: `${website.url}/favicon.ico`,
      savedAt: randomTimestamp(todayStart, todayEnd),
    });
  }

  for (let i = 0; i < itemsPerPeriod; i++) {
    const website = websites[(i + 10) % websites.length];

    // Yesterday
    tabs.push({
      id: uuidv4(),
      title: website.name,
      url: website.url,
      favicon: `${website.url}/favicon.ico`,
      savedAt: randomTimestamp(yesterdayStart, yesterdayEnd),
    });
  }

  for (let i = 0; i < itemsPerPeriod; i++) {
    const website = websites[(i + 20) % websites.length];

    // Last week
    tabs.push({
      id: uuidv4(),
      title: website.name,
      url: website.url,
      favicon: `${website.url}/favicon.ico`,
      savedAt: randomTimestamp(lastWeekStart, lastWeekEnd),
    });
  }

  for (let i = 0; i < itemsPerPeriod; i++) {
    const website = websites[(i + 30) % websites.length];

    // Last month
    tabs.push({
      id: uuidv4(),
      title: website.name,
      url: website.url,
      favicon: `${website.url}/favicon.ico`,
      savedAt: randomTimestamp(lastMonthStart, lastMonthEnd),
    });
  }

  for (let i = 0; i < itemsPerPeriod; i++) {
    const website = websites[(i + 40) % websites.length];

    // Last quarter
    tabs.push({
      id: uuidv4(),
      title: website.name,
      url: website.url,
      favicon: `${website.url}/favicon.ico`,
      savedAt: randomTimestamp(lastQuarterStart, lastQuarterEnd),
    });
  }

  return tabs;
};

export const mockTabs: SavedTab[] = generateMockTabs();
