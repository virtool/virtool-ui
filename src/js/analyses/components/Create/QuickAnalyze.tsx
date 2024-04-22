import { DialogPortal } from "@radix-ui/react-dialog";
import { merge } from "lodash";
import { filter, forEach, uniqBy } from "lodash-es";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Badge, Dialog, DialogOverlay, DialogTitle, Icon, Tabs, TabsLink } from "../../../base";
import { HMMSearchResults } from "../../../hmm/types";
import { IndexMinimal } from "../../../indexes/types";
import { MLModelSearchResult } from "../../../ml/types";
import { SampleMinimal } from "../../../samples/types";
import { SubtractionShortlist } from "../../../subtraction/types";
import { HistoryType } from "../../../utils/hooks";
import { useCreateAnalysis } from "../../queries";
import { Workflows } from "../../types";
import HMMAlert from "../HMMAlert";
import { CreateAnalysisDialogContent } from "./CreateAnalysisDialogContent";
import { CreateAnalysisForm, CreateAnalysisFormValues } from "./CreateAnalysisForm";
import { SelectedSamples } from "./SelectedSamples";
import { getCompatibleWorkflows } from "./workflows";
import { WorkflowSelector } from "./WorkflowSelector";

const QuickAnalyzeSelected = styled.span`
    align-self: center;
    margin: 0 15px 0 auto;
`;

type History = HistoryType & {
    location: {
        state: {
            quickAnalysis?: boolean;
        };
    };
};

/**
 * Gets the quick analysis mode
 *
 * @param libraryType - The library type of the sample
 * @param history - The history object
 * @returns The quick analysis mode
 */
export function getQuickAnalysisMode(libraryType: string, history: History) {
    if (history.location.state?.quickAnalysis === true) {
        if (libraryType === "amplicon") {
            return "barcode";
        }

        return "genome";
    }
}

/**
 * Gets the compatible samples
 *
 * @param mode - The quick analysis mode
 * @param samples - The selected samples
 * @returns A list of compatible samples
 */
export function getCompatibleSamples(mode: string, samples: SampleMinimal[]) {
    return filter(samples, (sample: SampleMinimal) => {
        if (mode === "barcode") {
            return sample.library_type === "amplicon";
        }

        return sample.library_type === "normal" || sample.library_type === "srna";
    });
}

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
    const history = useHistory();
    const location = useLocation<{ quickAnalysis: string; workflow: Workflows }>();
    const mode = getQuickAnalysisMode(samples[0]?.library_type, history);
    const workflow = location.state?.workflow;

    const show = Boolean(mode);
    const compatibleSamples = getCompatibleSamples(mode, samples);

    const createAnalysis = useCreateAnalysis();

    const barcode = samples.filter(sample => sample.library_type === "amplicon");
    const genome = samples.filter(sample => sample.library_type !== "amplicon");

    function onHide() {
        history.push({ ...history.location, state: { quickAnalysis: false } });
    }

    // The dialog should close when all selected samples have been analyzed and deselected.
    useEffect(() => {
        if (show && compatibleSamples.length === 0) {
            onHide();
        }
    }, [mode]);

    function getReferenceId(selectedIndexes: string[]) {
        const selectedCompatibleIndexes = indexes.filter(index => selectedIndexes.includes(index.id));
        const referenceIds = selectedCompatibleIndexes.map(index => index.reference.id);

        return uniqBy(referenceIds, "id");
    }

    function handleSubmit({ indexes, subtractions, workflow, mlModel }: CreateAnalysisFormValues) {
        const referenceIds = getReferenceId(indexes);

        forEach(compatibleSamples, ({ id }) => {
            forEach(referenceIds, (refId: string) => {
                createAnalysis.mutate({
                    refId,
                    sampleId: id,
                    subtractionIds: subtractions,
                    mlModel,
                    workflow,
                });
            });
        });
        onClear();
        onHide();
    }

    const compatibleWorkflows = getCompatibleWorkflows(mode ?? "genome", Boolean(hmms.total_count));

    function onChangeWorkflow(workflow: Workflows) {
        history.push(merge(location, { state: { workflow } }));
    }

    return (
        <Dialog open={show} onOpenChange={() => onHide()}>
            <DialogPortal>
                <DialogOverlay />
                <CreateAnalysisDialogContent>
                    <DialogTitle>Quick Analyze</DialogTitle>
                    <Tabs>
                        {genome.length > 0 && (
                            <TabsLink to={{ state: { quickAnalysis: "genome" } }} isActive={() => mode === "genome"}>
                                <Icon name="dna" /> Genome <Badge>{genome.length}</Badge>
                            </TabsLink>
                        )}
                        {barcode.length > 0 && (
                            <TabsLink to={{ state: { quickAnalysis: "barcode" } }} isActive={() => mode === "barcode"}>
                                <Icon name="barcode" /> Barcode <Badge>{barcode.length}</Badge>
                            </TabsLink>
                        )}
                        <QuickAnalyzeSelected>
                            {samples.length} sample{samples.length > 1 ? "s" : ""} selected
                        </QuickAnalyzeSelected>
                    </Tabs>
                    <SelectedSamples samples={compatibleSamples} />
                    {mode === "genome" && <HMMAlert installed={hmms.status.task.complete} />}
                    <WorkflowSelector
                        onSelect={onChangeWorkflow}
                        selected={location.state?.workflow}
                        workflows={compatibleWorkflows}
                    />
                    <CreateAnalysisForm
                        compatibleIndexes={indexes}
                        defaultSubtractions={[]}
                        mlModels={mlModels.items}
                        onSubmit={handleSubmit}
                        sampleCount={samples.length}
                        subtractions={subtractionOptions}
                        workflow={workflow}
                    />
                </CreateAnalysisDialogContent>
            </DialogPortal>
        </Dialog>
    );
}
