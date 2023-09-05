import { get } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledAnalysisCacheLink = styled(Link)`
    float: right;
    font-size: ${props => props.theme.fontSize.md};
`;

export const AnalysisCacheLink = ({ id, sampleId }) => {
    if (id) {
        return <StyledAnalysisCacheLink to={`/samples/${sampleId}/files/${id}`}>View QC</StyledAnalysisCacheLink>;
    }

    return null;
};

const mapStateToProps = state => ({
    id: get(state, "analyses.detail.cache.id"),
    sampleId: state.samples.detail.id,
});

export default connect(mapStateToProps)(AnalysisCacheLink);
