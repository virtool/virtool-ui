import { get } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../app/theme";
import { Box, Icon } from "../../base";

const OTUItemName = styled(Link)`
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
`;

const OtuItemUnverified = styled.span`
    align-items: center;
    display: flex;
    gap: 5px;
    justify-content: flex-end;
`;

const StyledOTUItem = styled(Box)`
    align-items: center;
    display: grid;
    grid-template-columns: 5fr 2fr 1fr;
`;

export function OTUItem({ abbreviation, id, name, refId, verified }) {
    return (
        <StyledOTUItem key={id}>
            <OTUItemName to={`/refs/${refId}/otus/${id}`}>{name}</OTUItemName>
            <span>{abbreviation}</span>
            {verified || (
                <OtuItemUnverified>
                    <Icon name="tag" />
                    Unverified
                </OtuItemUnverified>
            )}
        </StyledOTUItem>
    );
}

export function mapStateToProps(state, props) {
    const { abbreviation, id, name, verified } = get(state, ["otus", "documents", props.index]);

    return {
        abbreviation,
        id,
        name,
        verified,
        refId: state.references.detail.id,
    };
}

export default connect(mapStateToProps)(OTUItem);
