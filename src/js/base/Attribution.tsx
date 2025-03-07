import { cn } from "@/utils";
import { capitalize } from "lodash-es";
import React from "react";
import InitialIcon from "./InitialIcon";
import RelativeTime from "./RelativeTime";

type AttributionProps = {
    className?: string;
    time: string;
    user?: string;
    verb?: string;
};

export default function Attribution({
    className = "",
    time,
    user,
    verb = "created",
}: AttributionProps) {
    return (
        <span className={cn(className, "inline-flex", "items-center gap-2")}>
            {user ? <InitialIcon size="md" handle={user} /> : null}
            <span>
                {user} {user ? verb : capitalize(verb)}{" "}
                <RelativeTime time={time} />
            </span>
        </span>
    );
}
