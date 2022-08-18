import styled from "styled-components";
import { BoxGroupSection, Icon } from "../../../base";
import React from "react";
import { map, sortBy } from "lodash-es";

const StyledSourceTypeItem = styled(BoxGroupSection)`
    display: flex;
    justify-content: left;
    align-items: center;
    text-transform: capitalize;
    span: first-child {
        margin-right: 5px;
    }
    button.fas {
        margin-left: auto;
    }
`;

export const SourceTypeItem = ({ onRemove, sourceType, disabled }) => {
    return (
        <StyledSourceTypeItem disabled={disabled}>
            <span>{sourceType}</span>
            {disabled ? null : (
                <Icon name={"trash"} aria-label={"trash"} color={"red"} onClick={() => onRemove(sourceType)} />
            )}
        </StyledSourceTypeItem>
    );
};

export const SourceTypeList = ({ sourceTypes, disabled, onRemove }) => {
    return map(sortBy(sourceTypes), sourceType => (
        <SourceTypeItem key={sourceType} onRemove={onRemove} sourceType={sourceType} disabled={disabled} />
    ));
};
