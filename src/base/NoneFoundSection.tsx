import { cn } from "@/app/utils";
import { CircleAlert } from "lucide-react";
import { ReactNode } from "react";
import BoxGroupSection from "./BoxGroupSection";
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
            <CircleAlert size={18} /> No {noun} found{childrenContainer}
        </BoxGroupSection>
    );
}
