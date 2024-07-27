import React from "react";

export function ContainerWide({ children }) {
    return <div className="absolute left-[30px] right-[30px]">{children}</div>;
}

ContainerWide.displayName = "ContainerWide";
