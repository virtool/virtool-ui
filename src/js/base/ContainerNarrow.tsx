import React from "react";

export function ContainerNarrow({ children }) {
    return <div className="flex-grow flex-shrink-0 max-w-[1150px]">{children}</div>;
}

ContainerNarrow.displayName = "ContainerNarrow";
