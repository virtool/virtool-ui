import { capitalize } from "es-toolkit";
import styled from "styled-components";
import InitialIcon from "./InitialIcon";

type UnstyledAttributionWithNameProps = {
    className?: string;
    user: string;
    verb?: string;
};

function UnstyledAttributionWithName({
    className = "",
    user,
    verb = "created",
}: UnstyledAttributionWithNameProps) {
    return (
        <span className={className}>
            {capitalize(verb)} by{" "}
            {user ? <InitialIcon size="md" handle={user} /> : null} {user}
        </span>
    );
}

const AttributionWithName = styled(UnstyledAttributionWithName)`
    align-items: center;
    display: inline-flex;
    font-size: inherit;

    .InitialIcon {
        margin-right: 3px;
        margin-left: 6px;
    }
`;

export default AttributionWithName;
