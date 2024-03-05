import React, { useCallback } from "react";
import styled from "styled-components";
import { getActiveShadow } from "../../../../app/theme";
import { BoxGroupSection, Icon } from "../../../../base";
import { ReferenceDataType } from "../../../../references/types";
import { formatIsolateName } from "../../../../utils/utils";
import { OTUIsolate } from "../../../types";

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
    /** A callback function to handle the selection of isolates */
    onClick: (isolateId: string) => void;
};

/**
 * A condensed isolate item for use in a list of isolates
 */
export default function IsolateItem({ active, dataType, isolate, onClick }: IsolateItemProps) {
    const handleSelectIsolate = useCallback(() => {
        onClick(isolate.id);
    }, [isolate.id]);

    return (
        <StyledIsolateItem active={active} onClick={handleSelectIsolate}>
            <span>{formatIsolateName(isolate)}</span>
            {isolate.default && dataType !== "barcode" && <Icon name="star" />}
        </StyledIsolateItem>
    );
}
