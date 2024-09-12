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
import styled from "styled-components";
import { useParams } from "wouter";
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

/** Base component viewing all supported analysis */
export default function AnalysisDetail() {
    const { analysisId, sampleId } = useParams();
    const { data: analysis, isPending, error } = useGetAnalysis(analysisId);
    const { data: sample, isPending: isPendingSample } = useFetchSample(sampleId);

    if (error?.response.status === 404) {
        return <NotFound />;
    }

    if (isPending || isPendingSample) {
        return <LoadingPlaceholder />;
    }

    if (!analysis.ready) {
        return (
            <Box>
                <LoadingPlaceholder className="mt-5" message="Analysis in progress" />
            </Box>
        );
    }

    let content;

    if (analysis.workflow === "pathoscope_bowtie") {
        content = <PathoscopeViewer detail={analysis} sample={sample} />;
    } else if (analysis.workflow === "nuvs") {
        content = <NuVsViewer detail={analysis} sample={sample} />;
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
