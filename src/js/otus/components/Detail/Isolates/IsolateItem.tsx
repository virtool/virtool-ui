import { BoxGroupSection, Icon } from "@/base";
import { getActiveShadow } from "@app/theme";
import { OTUIsolate } from "@otus/types";
import { useUrlSearchParam } from "@/hooks";
import { formatIsolateName } from "@/utils";
import React from "react";
import styled from "styled-components";

const StyledIsolateItem = styled(BoxGroupSection)`
    align-items: center;
    border: none;
    box-shadow: ${getActiveShadow};
    display: flex;

    & > span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    i.fas {
        margin-left: auto;
    }
`;

type IsolateItemProps = {
    /** Whether the Isolate is selected */
    active: boolean;
    isolate: OTUIsolate;
};

/**
 * A condensed isolate item for use in a list of isolates
 */
export default function IsolateItem({ active, isolate }: IsolateItemProps) {
    const { setValue: setActiveIsolate } =
        useUrlSearchParam<string>("activeIsolate");

    return (
        <StyledIsolateItem
            active={active}
            onClick={() => setActiveIsolate(isolate.id)}
        >
            <span>{formatIsolateName(isolate)}</span>
            {isolate.default && <Icon name="star" />}
        </StyledIsolateItem>
    );
}
