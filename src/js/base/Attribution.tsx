import { capitalize } from "lodash-es";
import React from "react";
import styled from "styled-components/macro";
import { InitialIcon } from "./InitialIcon";
import { RelativeTime } from "./RelativeTime";

type UnstyledAttributionProps = {
    className?: string;
    time: string;
    user?: string;
    verb?: string;
};

function UnstyledAttribution({ className = "", time, user, verb = "created" }: UnstyledAttributionProps) {
    return (
        <span className={className}>
            {user ? <InitialIcon size="md" handle={user} /> : null}
            <span>
                {user} {user ? verb : capitalize(verb)} <RelativeTime time={time} />
            </span>
        </span>
    );
}

export const Attribution = styled(UnstyledAttribution)`
    align-items: center;
    display: inline-flex;
    font-size: inherit;
    .InitialIcon {
        margin-right: 5px;
    }
`;
