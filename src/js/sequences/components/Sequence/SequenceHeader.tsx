import { ChildrenOnlyProps } from "@/types/components";
import React from "react";

export function SequenceHeader({ children }: ChildrenOnlyProps) {
    return <div className="flex items-start">{children}</div>;
}
