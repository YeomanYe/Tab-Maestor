const isDev = import.meta.env.DEV;

type LogArgs = unknown[];

export const logger = {
  log: (...args: LogArgs): void => {
    if (isDev) console.log(...args);
  },
  warn: (...args: LogArgs): void => {
    if (isDev) console.warn(...args);
  },
  error: (...args: LogArgs): void => {
    console.error(...args);
  },
};
