import { useGetAnalysis } from "@/analyses/queries";
import { useFetchSample } from "@samples/queries";
import { getWorkflowDisplayName } from "@utils/utils";
import { get } from "lodash-es";
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
import { setAnalysis } from "../actions";
import AODPViewer from "./AODP/Viewer";
import { IimiViewer } from "./Iimi/IimiViewer";
import NuVsViewer from "./NuVs/Viewer";
import { PathoscopeViewer } from "./Pathoscope/PathoscopeViewer";

const UnsupportedAnalysis = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;

    i.fas {
        margin-right: 5px;
    }
`;

export function AnalysisDetail({ detail, match, onSetAnalysis }) {
    const analysisId = match.params.analysisId;
    const { data: analysis, isLoading, error, isError } = useGetAnalysis(analysisId);

    const sampleId = match.params.sampleId;
    const { data: sample, isLoading: isLoadingSample } = useFetchSample(sampleId);

    // console.log({ analysis, detail });

    useEffect(() => {
        if (analysis) {
            onSetAnalysis(analysis);
        }
    }, [analysis]);

    if (error?.status == 404) {
        return <NotFound />;
    }

    if (isLoading || isLoadingSample || !detail?.ready) {
        return <LoadingPlaceholder />;
    }

    if (!analysis.ready) {
        return (
            <Box>
                <LoadingPlaceholder message="Analysis in progress" margin="1.2rem" />
            </Box>
        );
    }

    let content;

    if (analysis.workflow === "pathoscope_bowtie") {
        content = <PathoscopeViewer detail={analysis} sample={sample} />;
    } else if (analysis.workflow === "nuvs") {
        content = <NuVsViewer />;
    } else if (analysis.workflow === "aodp") {
        content = <AODPViewer />;
    } else if (analysis.workflow === "iimi") {
        content = <IimiViewer detail={analysis} />;
    } else {
        return (
            <>
                <UnsupportedAnalysis>
                    <Icon name={"info-circle"} />
                    Workflow not yet supported.
                </UnsupportedAnalysis>
            </>
        );
    }

    return (
        <div>
            <SubviewHeader>
                <SubviewHeaderTitle>
                    {getWorkflowDisplayName(analysis.workflow)} for {sample.name}
                </SubviewHeaderTitle>
                <SubviewHeaderAttribution>
                    {analysis.user.handle} started <RelativeTime time={analysis.created_at} />
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
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        onSetAnalysis: analysis => {
            dispatch(setAnalysis(analysis));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisDetail);
