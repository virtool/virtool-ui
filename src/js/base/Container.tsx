import React from "react";

export function Container({ children }) {
    return <div className="max-w-full px-[35px] pl-[98px] w-screen">{children}</div>;
}

Container.displayName = "Container";
