import { ScrollSyncContext } from "@base/ScrollSyncContext";
import React, { useState } from "react";

type ScrollSyncProps = {
    children: React.ReactNode;
};

/**
 * Manages the context and synchronises scroll between subscribed components
 *
 * @param children - the component to synchronise scroll within
 */
export default function ScrollSyncContainer({ children }: ScrollSyncProps) {
    const [scrollPixels, setScrollPixels] = useState(0);

    return (
        <ScrollSyncContext.Provider value={[scrollPixels, setScrollPixels]}>
            {children}
        </ScrollSyncContext.Provider>
    );
}
