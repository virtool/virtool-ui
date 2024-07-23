import AODPViewer from "@/analyses/components/AODP/Viewer";
import { useGetAnalysis } from "@/analyses/queries";
import {
    Box,
    Icon,
    LoadingPlaceholder,
    NotFound,
    RelativeTime,
    SubviewHeader,
    SubviewHeaderAttribution,
    SubviewHeaderTitle,
} from "@base";
import { useFetchSample } from "@samples/queries";
import { getWorkflowDisplayName } from "@utils/utils";
import React from "react";
import { match } from "react-router-dom";
import styled from "styled-components";
import { IimiViewer } from "./Iimi/IimiViewer";
import NuVsViewer from "./NuVs/NuVsViewer";
import { PathoscopeViewer } from "./Pathoscope/PathoscopeViewer";

const UnsupportedAnalysis = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;

    i.fas {
        margin-right: 5px;
    }
`;

type AnalysisDetailProps = {
    /** Match object containing path information */
    match: match<{ analysisId: string; sampleId: string }>;
};

/** Base component viewing all supported analysis */
export default function AnalysisDetail({ match }: AnalysisDetailProps) {
    const { analysisId, sampleId } = match.params;
    const { data: analysis, isLoading, error } = useGetAnalysis(analysisId);
    const { data: sample, isLoading: isLoadingSample } = useFetchSample(sampleId);

    if (error?.response.status === 404) {
        return <NotFound />;
    }

    if (isLoading || isLoadingSample) {
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
        content = <NuVsViewer detail={analysis} sample={sample} />;
    } else if (analysis.workflow === "aodp") {
        content = <AODPViewer />;
    } else if (analysis.workflow === "iimi") {
        content = <IimiViewer detail={analysis} />;
    } else {
        return (
            <UnsupportedAnalysis>
                <Icon name={"info-circle"} />
                Workflow not yet supported.
            </UnsupportedAnalysis>
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
