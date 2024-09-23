import { HMMSearchResults } from "@/hmm/types";
import { Badge, Dialog, DialogOverlay, DialogTitle, Icon, Tabs, TabsLink } from "@base";
import { IndexMinimal } from "@indexes/types";
import { MLModelSearchResult } from "@ml/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { SampleMinimal } from "@samples/types";
import { SubtractionShortlist } from "@subtraction/types";
import { formatSearchParams, useUrlSearchParams } from "@utils/hooks";
import { filter, forEach } from "lodash-es";
import React, { useEffect } from "react";

import { Workflows } from "@/analyses/types";
import styled from "styled-components";
import { useLocation, useSearch } from "wouter";
import { useCreateAnalysis } from "../../queries";
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
    const search = useSearch();
    const [_, navigate] = useLocation();
    const [workflow, setWorkflow] = useUrlSearchParams("workflow");
    const [openQuickAnalysis] = useUrlSearchParams("openQuickAnalysis");

    const mode = samples[0]?.library_type == "amplicon" ? "barcode" : "genome";

    const compatibleSamples = getCompatibleSamples(mode, samples);

    const createAnalysis = useCreateAnalysis();

    const barcode = samples.filter(sample => sample.library_type === "amplicon");
    const genome = samples.filter(sample => sample.library_type !== "amplicon");

    function onHide() {
        const searchParams = new URLSearchParams(search);
        searchParams.delete("openQuickAnalysis");
        searchParams.delete("workflow");

        const searchString = searchParams.toString();
        navigate(searchString ? `?${searchParams.toString()}` : "");
    }

    // The dialog should close when all selected samples have been analyzed and deselected.
    useEffect(() => {
        if (openQuickAnalysis && compatibleSamples.length === 0) {
            onHide();
        }
    }, [openQuickAnalysis, compatibleSamples.length]);

    function getReferenceId(selectedIndex: string) {
        return indexes.find(index => index.reference.name === selectedIndex)?.reference.id;
    }

    function handleSubmit({ index, subtractions, workflow, mlModel }: CreateAnalysisFormValues) {
        const refId = getReferenceId(index);

        forEach(compatibleSamples, ({ id }) => {
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

    const compatibleWorkflows = getCompatibleWorkflows(mode ?? "genome", Boolean(hmms.total_count));

    return (
        <Dialog open={Boolean(openQuickAnalysis)} onOpenChange={() => onHide()}>
            <DialogPortal>
                <DialogOverlay />
                <CreateAnalysisDialogContent>
                    <DialogTitle>Quick Analyze</DialogTitle>
                    <Tabs>
                        {genome.length > 0 && (
                            <TabsLink
                                to={formatSearchParams("workflow", "genome", search)}
                                isActive={mode === "genome"}
                            >
                                <Icon name="dna" /> Genome <Badge>{genome.length}</Badge>
                            </TabsLink>
                        )}
                        {barcode.length > 0 && (
                            <TabsLink
                                to={formatSearchParams("workflow", "barcode", search)}
                                isActive={mode === "barcode"}
                            >
                                <Icon name="barcode" /> Barcode <Badge>{barcode.length}</Badge>
                            </TabsLink>
                        )}
                        <QuickAnalyzeSelected>
                            {samples.length} sample{samples.length > 1 ? "s" : ""} selected
                        </QuickAnalyzeSelected>
                    </Tabs>
                    <SelectedSamples samples={compatibleSamples} />
                    {mode === "genome" && <HMMAlert installed={hmms.status.task?.complete} />}
                    <WorkflowSelector onSelect={setWorkflow} selected={workflow} workflows={compatibleWorkflows} />
                    <CreateAnalysisForm
                        compatibleIndexes={indexes}
                        defaultSubtractions={[]}
                        mlModels={mlModels.items}
                        onSubmit={handleSubmit}
                        sampleCount={samples.length}
                        subtractions={subtractionOptions}
                        workflow={Workflows[workflow]}
                    />
                </CreateAnalysisDialogContent>
            </DialogPortal>
        </Dialog>
    );
}
