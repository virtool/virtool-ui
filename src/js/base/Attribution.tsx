import { capitalize } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { InitialIcon } from "./InitialIcon";
import { RelativeTime } from "./RelativeTime";

type AttributionProps = {
    className?: string;
    time: string;
    user?: string;
    verb?: string;
};

export const Attribution = styled(({ className = "", time, user, verb = "created" }: AttributionProps) => {
    return (
        <span className={className}>
            {user ? <InitialIcon size="md" handle={user} /> : null}
            <span>
                {user} {user ? verb : capitalize(verb)} <RelativeTime time={time} />
            </span>
        </span>
    );
})`
    align-items: center;
    display: inline-flex;
    font-size: inherit;
    .InitialIcon {
        margin-right: 5px;
    }
`;

Attribution.displayName = "Attribution";
