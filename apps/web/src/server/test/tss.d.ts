// The Vite plugin moves server-function handler bodies into a virtual
// `?tss-serverfn-split` module. TypeScript cannot resolve the suffixed
// specifier, so tests importing one to reach the real handler declare it here
// and cast the namespace to `SplitServerFnModule`.
declare module "*?tss-serverfn-split";
