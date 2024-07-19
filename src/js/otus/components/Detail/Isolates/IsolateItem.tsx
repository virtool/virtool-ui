import { BoxGroupSection, Icon } from "@/base";
import { getActiveShadow } from "@app/theme";
import { OTUIsolate } from "@otus/types";
import { ReferenceDataType } from "@references/types";
import { useLocationState } from "@utils/hooks";
import { formatIsolateName } from "@utils/utils";
import { merge } from "lodash";
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
    dataType: ReferenceDataType;
    isolate: OTUIsolate;
};

/**
 * A condensed isolate item for use in a list of isolates
 */
export default function IsolateItem({ active, dataType, isolate }: IsolateItemProps) {
    const [locationState, setLocationState] = useLocationState();

    return (
        <StyledIsolateItem
            active={active}
            onClick={() => setLocationState(merge(locationState, { activeIsolateId: isolate.id }))}
        >
            <span>{formatIsolateName(isolate)}</span>
            {isolate.default && dataType !== "barcode" && <Icon name="star" />}
        </StyledIsolateItem>
    );
}
