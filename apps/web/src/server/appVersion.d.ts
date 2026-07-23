// `__APP_VERSION__` is injected by Vite's `define` (see vite.config.js) and is
// substituted in server-transformed modules too. Declared here because the
// server tsconfig does not include the app's vite-env.d.ts, where the browser
// program picks up the same global.
declare const __APP_VERSION__: string;
