import { useUrlSearchParam } from "@/hooks";
import { Workflows } from "@analyses/types";
import Dialog from "@base/Dialog";
import DialogOverlay from "@base/DialogOverlay";
import DialogTitle from "@base/DialogTitle";
import { HMMSearchResults } from "@hmm/types";
import { IndexMinimal } from "@indexes/types";
import { MLModelSearchResult } from "@ml/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { SampleMinimal } from "@samples/types";
import { SubtractionShortlist } from "@subtraction/types";
import { forEach, includes } from "lodash-es";
import React, { useEffect } from "react";
import styled from "styled-components";
import { useCreateAnalysis } from "../../queries";
import HMMAlert from "../HMMAlert";
import CreateAnalysisDialogContent from "./CreateAnalysisDialogContent";
import {
    CreateAnalysisForm,
    CreateAnalysisFormValues,
} from "./CreateAnalysisForm";
import { SelectedSamples } from "./SelectedSamples";
import { WorkflowSelector } from "./WorkflowSelector";
import { getCompatibleWorkflows } from "./workflows";

const QuickAnalyzeSelected = styled.span`
    align-self: center;
    margin: 0 15px 0 auto;
`;

type QuickAnalyzeProps = {
    /** The HMM search results */
    hmms: HMMSearchResults;

    /** A list of indexes with the minimal data */
    indexes: IndexMinimal[];

    /** The ML Model search results */
    mlModels: MLModelSearchResult;

    /** A callback function to clear selected samples */
    onClear: () => void;

    /** The selected samples */
    samples: SampleMinimal[];

    /** A shortlist of ready subtractions */
    subtractionOptions: SubtractionShortlist[];
};

/**
 * A form for triggering quick analyses on selected samples
 */
export default function QuickAnalyze({
    hmms,
    indexes,
    mlModels,
    onClear,
    samples,
    subtractionOptions,
}: QuickAnalyzeProps) {
    const {
        value: quickAnalysisType,
        setValue: setQuickAnalysisType,
        unsetValue: unsetQuickAnalysisType,
    } = useUrlSearchParam<string>("quickAnalysisType");

    const createAnalysis = useCreateAnalysis();

    function onHide() {
        unsetQuickAnalysisType();
    }

    // The dialog should close when all selected samples have been analyzed and deselected.
    useEffect(() => {
        if (quickAnalysisType && samples.length === 0) {
            onHide();
        }
    }, [samples.length, quickAnalysisType]);

    function getReferenceId(selectedIndex: string) {
        return indexes.find((index) => index.reference.name === selectedIndex)
            ?.reference.id;
    }

    function handleSubmit({
        index,
        subtractions,
        workflow,
        mlModel,
    }: CreateAnalysisFormValues) {
        const refId = getReferenceId(index);

        forEach(samples, ({ id }) => {
            createAnalysis.mutate({
                refId,
                sampleId: id,
                subtractionIds: subtractions,
                mlModel,
                workflow,
            });
        });
        onClear();
        onHide();
    }

    const compatibleWorkflows = getCompatibleWorkflows(
        Boolean(hmms.total_count),
    );

    return (
        <Dialog
            open={includes(Workflows, quickAnalysisType)}
            onOpenChange={() => onHide()}
        >
            <DialogPortal>
                <DialogOverlay />
                <CreateAnalysisDialogContent>
                    <DialogTitle>Quick Analyze</DialogTitle>
                    <QuickAnalyzeSelected>
                        {samples.length} sample
                        {samples.length > 1 ? "s" : ""} selected
                    </QuickAnalyzeSelected>
                    <SelectedSamples samples={samples} />
                    <HMMAlert installed={hmms.status.task?.complete} />
                    <WorkflowSelector
                        onSelect={setQuickAnalysisType}
                        selected={quickAnalysisType}
                        workflows={compatibleWorkflows}
                    />
                    <CreateAnalysisForm
                        compatibleIndexes={indexes}
                        defaultSubtractions={[]}
                        mlModels={mlModels.items}
                        onSubmit={handleSubmit}
                        sampleCount={samples.length}
                        subtractions={subtractionOptions}
                        workflow={Workflows[quickAnalysisType]}
                    />
                </CreateAnalysisDialogContent>
            </DialogPortal>
        </Dialog>
    );
}
