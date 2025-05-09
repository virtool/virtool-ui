import NuvsViewer from "@analyses/components/Nuvs/NuvsViewer";
import { usePathParams } from "@app/hooks";
import { getWorkflowDisplayName } from "@app/utils";
import Box from "@base/Box";
import Icon from "@base/Icon";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NotFound from "@base/NotFound";
import RelativeTime from "@base/RelativeTime";
import SubviewHeader from "@base/SubviewHeader";
import SubviewHeaderAttribution from "@base/SubviewHeaderAttribution";
import SubviewHeaderTitle from "@base/SubviewHeaderTitle";
import { useFetchSample } from "@samples/queries";
import React from "react";
import styled from "styled-components";
import { useGetAnalysis } from "../queries";
import {
    FormattedNuvsAnalysis,
    FormattedPathoscopeAnalysis,
    IimiAnalysis,
} from "../types";
import { IimiViewer } from "./Iimi/IimiViewer";
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
    const { analysisId, sampleId } = usePathParams<{
        analysisId: string;
        sampleId: string;
    }>();
    const { data: analysis, isPending, error } = useGetAnalysis(analysisId);
    const { data: sample, isPending: isPendingSample } =
        useFetchSample(sampleId);

    if (error?.response.status === 404) {
        return <NotFound />;
    }

    if (isPending || isPendingSample) {
        return <LoadingPlaceholder />;
    }

    if (!analysis.ready) {
        return (
            <Box>
                <LoadingPlaceholder
                    className="mt-5"
                    message="Analysis in progress"
                />
            </Box>
        );
    }

    let content;

    if (analysis.workflow === "pathoscope_bowtie") {
        content = (
            <PathoscopeViewer
                detail={analysis as FormattedPathoscopeAnalysis}
                sample={sample}
            />
        );
    } else if (analysis.workflow === "nuvs") {
        content = (
            <NuvsViewer
                detail={analysis as FormattedNuvsAnalysis}
                sample={sample}
            />
        );
    } else if (analysis.workflow === "iimi") {
        content = <IimiViewer detail={analysis as IimiAnalysis} />;
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
                    {getWorkflowDisplayName(analysis.workflow)} for{" "}
                    {sample.name}
                </SubviewHeaderTitle>
                <SubviewHeaderAttribution>
                    {analysis.user.handle} started{" "}
                    <RelativeTime time={analysis.created_at} />
                </SubviewHeaderAttribution>
            </SubviewHeader>

            {content}
        </div>
    );
}
