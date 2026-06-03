import { createContext, type Dispatch, type SetStateAction } from "react";

/** The scroll position in pixels paired with its setter, shared across synced components. */
export type ScrollSyncContextValue = [number, Dispatch<SetStateAction<number>>];

const ScrollSyncContext = createContext<ScrollSyncContextValue>([0, () => {}]);

export default ScrollSyncContext;
