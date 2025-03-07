import { cn } from "@/utils";
import BoxGroup from "@base/BoxGroup";
import IconButton from "@base/IconButton";
import { map } from "lodash-es";
import React from "react";
import { StateButton } from "./StateButton";

type StateCategoryProps = {
    /** The states associated with the inactive or active category */
    states: { [key: string]: any };

    /** The category title */
    label: string;

    /** A callback function to handle the state selection */
    onClick: (label: string) => void;
};

/**
 * Displays a category of job states available for filtering
 */
export function StateCategory({ states, label, onClick }: StateCategoryProps) {
    return (
        <BoxGroup className={cn("bg-white relative")}>
            <header className="flex font-medium items-center justify-between p-4 text-lg">
                <span>{label}</span>
                <IconButton
                    color="gray"
                    name="check-double"
                    onClick={() => onClick(label.toLowerCase())}
                    tip="Toggle All"
                />
            </header>
            <div className={cn("mb-0")}>
                {map(states, ({ active, color, count, state, label }) => (
                    <StateButton
                        key={state}
                        active={active}
                        color={color}
                        count={count}
                        label={label}
                        onClick={() => onClick(state)}
                    />
                ))}
            </div>
        </BoxGroup>
    );
}
