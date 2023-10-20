import { get, lowerCase } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
    Box,
    Icon,
    LoadingPlaceholder,
    NotFound,
    RelativeTime,
    SubviewHeader,
    SubviewHeaderAttribution,
    SubviewHeaderTitle,
} from "../../base/index";
import { getWorkflowDisplayName } from "../../utils/utils";
import { getAnalysis } from "../actions";
import AODPViewer from "./AODP/Viewer";
import AnalysisCache from "./CacheLink";
import NuVsViewer from "./NuVs/Viewer";
import { PathoscopeViewer } from "./Pathoscope/Viewer";

const UnsupportedAnalysis = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;

    i.fas {
        margin-right: 5px;
    }
`;

export function AnalysisDetail({ detail, error, match, sampleName, onGetAnalysis }) {
    const analysisId = match.params.analysisId;

    useEffect(() => {
        onGetAnalysis(analysisId);
    }, [analysisId]);

    if (error) {
        return <NotFound />;
    }

    if (detail === null || detail.id !== analysisId) {
        return <LoadingPlaceholder />;
    }

    if (!detail.ready) {
        return (
            <Box>
                <LoadingPlaceholder message="Analysis in progress" margin="1.2rem" />
            </Box>
        );
    }

    let content;

    if (detail.workflow === "pathoscope_bowtie") {
        content = <PathoscopeViewer />;
    } else if (detail.workflow === "nuvs") {
        content = <NuVsViewer />;
    } else if (detail.workflow === "aodp") {
        content = <AODPViewer />;
    } else {
        return (
            <>
                <UnsupportedAnalysis>
                    <Icon name={"info-circle"} />
                    Visualisation of {lowerCase(detail.workflow)} analyses is not yet supported.
                </UnsupportedAnalysis>
            </>
        );
    }

    return (
        <div>
            <SubviewHeader>
                <SubviewHeaderTitle>
                    {getWorkflowDisplayName(detail.workflow)} for {sampleName}
                    <AnalysisCache />
                </SubviewHeaderTitle>
                <SubviewHeaderAttribution>
                    {detail.user.handle} started <RelativeTime time={detail.created_at} />
                </SubviewHeaderAttribution>
            </SubviewHeader>

            {content}
        </div>
    );
}

export function mapStateToProps(state) {
    return {
        detail: state.analyses.detail,
        error: get(state, "errors.GET_ANALYSIS_ERROR", null),
        sampleName: state.samples.detail.name,
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        onGetAnalysis: analysisId => {
            dispatch(getAnalysis(analysisId));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisDetail);
