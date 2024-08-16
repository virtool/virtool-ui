import { cn } from "@utils/utils";
import React from "react";
import { BoxGroupSection } from "./BoxGroupSection";
import { Icon } from "./Icon";

type NoneFoundSectionProps = {
    children?: React.ReactNode;
    noun: string;
};

export function NoneFoundSection({ children, noun }: NoneFoundSectionProps) {
    let childrenContainer;

    if (children) {
        childrenContainer = <span>. {children}.</span>;
    }

    return (
        <BoxGroupSection className={cn("items-center", "flex", "justify-center")}>
            <Icon className={cn("mr-1.5")} name="info-circle" /> No {noun} found{childrenContainer}
        </BoxGroupSection>
    );
}
