declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

interface Window {
  chrome?: {
    storage?: {
      local?: {
        get: (key: string) => Promise<Record<string, unknown>>;
        set: (data: Record<string, unknown>) => Promise<void>;
      };
    };
    tabs?: {
      query: (query: object) => Promise<ChromeTab[]>;
      create: (props: { url: string; active?: boolean }) => Promise<ChromeTab>;
    };
  };
}

interface ChromeTab {
  id?: number;
  title?: string;
  url?: string;
  favIconUrl?: string;
  active?: boolean;
}
