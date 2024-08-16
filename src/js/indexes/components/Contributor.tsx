import { Badge, BoxGroupSection, InitialIcon } from "@base";
import { cn } from "@utils/utils";
import React from "react";

type ContributorProps = {
    id: string;
    count: number;
    handle: string;
};

/**
 * A condensed contributor item for use in a list of contributors
 */
export default function Contributor({ id, count, handle }: ContributorProps) {
    return (
        <BoxGroupSection className={cn("items-center", "flex", "gap-1.5")} key={id}>
            <InitialIcon handle={handle} size="md" />
            {handle}
            <Badge className="ml-auto">
                {count} change{count === 1 ? "" : "s"}
            </Badge>
        </BoxGroupSection>
    );
}
