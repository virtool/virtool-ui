import { cn } from "@/utils";
import Badge from "@base/Badge";
import BoxGroupSection from "@base/BoxGroupSection";
import Checkbox from "@base/Checkbox";
import Dot from "@base/Dot";
import React from "react";

type StateButtonProps = {
    /** Whether the state is selected */
    active: boolean;

    /** The number of jobs associated with the state */
    count: number;

    /** The state color */
    color: string;

    /** The name of the state */
    label: string;

    /** A callback function to handle the state selection */
    onClick: () => void;
};

/**
 * A condensed job state item for use in a list of job states
 */
export function StateButton({
    active,
    count = 0,
    color,
    label,
    onClick,
}: StateButtonProps) {
    const labelComponent = (
        <>
            <Dot color={color} />
            {label}
        </>
    );

    return (
        <BoxGroupSection
            className={cn(
                "capitalize",
                "flex",
                "gap-2",
                "items-center",
                "justify-between",
                "relative",
            )}
        >
            <Checkbox
                checked={active}
                id={`JobStateCheckbox-${label}`}
                label={label}
                labelComponent={labelComponent}
                onClick={onClick}
            />
            <Badge className="ml-auto">{count}</Badge>
        </BoxGroupSection>
    );
}
