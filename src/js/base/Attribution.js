import { capitalize } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { InitialIcon } from "./InitialIcon";
import { RelativeTime } from "./RelativeTime";

export const UnstyledAttribution = ({ className, time, user, verb = "created" }) => (
    <span className={className}>
        {user ? <InitialIcon size="md" handle={user} /> : null}
        <span>{user}</span>
        <span>{user ? verb : capitalize(verb)}</span>
        <RelativeTime time={time} />
    </span>
);

export const Attribution = styled(UnstyledAttribution)`
    align-items: center;
    display: inline-flex;
    font-size: inherit;

    *:not(:first-child) {
        margin-left: 3px;
    }
    .InitialIcon {
        margin-right: 5px;
    }
`;

export const UnstyledNameAttribution = ({ className, user, verb = "created" }) => (
    <span className={className}>
        <span>{capitalize(verb)} by </span>
        {user ? <InitialIcon size="md" handle={user} /> : null}
        <span>{user}</span>
    </span>
);

export const NameAttribution = styled(UnstyledNameAttribution)`
    align-items: center;
    display: inline-flex;
    font-size: inherit;

    *:not(:first-child) {
        margin-left: 3px;
    }
    .InitialIcon {
        margin-right: 1px;
        margin-left 7px;
    }
`;
