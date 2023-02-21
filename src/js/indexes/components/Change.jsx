import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { BoxSpaced } from "../../base";

const StyledIndexChange = styled(BoxSpaced)`
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

export const IndexChange = ({ description, otuName }) => (
    <StyledIndexChange>
        <strong>{otuName}</strong>
        {description}
    </StyledIndexChange>
);

export const mapStateToProps = (state, ownProps) => {
    const { otu, description } = state.indexes.history.documents[ownProps.index];
    return {
        description,
        otuName: otu.name
    };
};

export default connect(mapStateToProps)(IndexChange);
