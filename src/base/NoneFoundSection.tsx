import { cn } from "@/app/utils";
import { ReactNode } from "react";
import BoxGroupSection from "./BoxGroupSection";
import Icon from "./Icon";
import { noneFoundStyle } from "./noneFoundStyle";

type NoneFoundSectionProps = {
    children?: ReactNode;
    noun: string;
    className?: string;
};

export default function NoneFoundSection({
    children,
    noun,
    className,
}: NoneFoundSectionProps) {
    let childrenContainer;

    if (children) {
        childrenContainer = <span>. {children}.</span>;
    }

    return (
        <BoxGroupSection
            className={cn(noneFoundStyle, "justify-center", className)}
        >
            <Icon name="info-circle" /> No {noun} found{childrenContainer}
        </BoxGroupSection>
    );
}
