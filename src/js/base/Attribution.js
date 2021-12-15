import { capitalize } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { InitialIcon } from "./InitialIcon";
import { RelativeTime } from "./RelativeTime";

export const Attribution = ({ className, time, user, verb = "created" }) => (
    <StyledAttribution className={className}>
        {user ? <InitialIcon size="md" handle={user} /> : null}
        <span>{user}</span>
        <span>{user ? verb : capitalize(verb)}</span>
        <RelativeTime time={time} />
    </StyledAttribution>
);

export const StyledAttribution = styled.span`
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

export const NameAttribution = ({ className, user, verb = "created" }) => (
    <StyledNameAttribution className={className}>
        <span>{capitalize(verb)} by </span>
        {user ? <InitialIcon size="md" handle={user} /> : null}
        <span>{user}</span>
    </StyledNameAttribution>
);

export const StyledNameAttribution = styled.span`
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
