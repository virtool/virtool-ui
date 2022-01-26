import { capitalize } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { InitialIcon } from "./InitialIcon";
import { RelativeTime } from "./RelativeTime";

export const UnstyledAttribution = ({ className, time, user, verb = "created" }) => (
    <span className={className}>
        {user ? <InitialIcon size="md" handle={user} /> : null}
        <span>
            {user} {user ? verb : capitalize(verb)} <RelativeTime time={time} />
        </span>
    </span>
);

export const Attribution = styled(UnstyledAttribution)`
    align-items: center;
    display: inline-flex;
    font-size: inherit;
    .InitialIcon {
        margin-right: 5px;
    }
`;

export const UnstyledNameAttribution = ({ className, user, verb = "created" }) => (
    <span className={className}>
        {capitalize(verb)} by {user ? <InitialIcon size="md" handle={user} /> : null} {user}
    </span>
);

export const NameAttribution = styled(UnstyledNameAttribution)`
    align-items: center;
    display: inline-flex;
    font-size: inherit;


    .InitialIcon {
        margin-right: 3px;
        margin-left 6px;
    }
`;
