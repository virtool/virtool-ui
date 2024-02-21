import { DialogPortal } from "@radix-ui/react-dialog";
import { filter, forEach, groupBy, map, maxBy } from "lodash-es";
import { includes, keysIn } from "lodash-es/lodash";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Dialog, DialogOverlay, DialogTitle } from "../../../base";
import { HMMSearchResults } from "../../../hmm/types";
import { useListIndexes } from "../../../indexes/querys";
import { useFindModels } from "../../../ml/queries";
import { useFetchSample } from "../../../samples/querys";
import { useFetchSubtractionsShortlist } from "../../../subtraction/querys";
import { useCreateAnalysis } from "../../querys";
import { Workflows } from "../../types";
import HMMAlert from "../HMMAlert";
import { CreateAnalysisDialogContent } from "./CreateAnalysisDialogContent";
import { CreateAnalysisForm, CreateAnalysisFormValues } from "./CreateAnalysisForm";
import { getCompatibleWorkflows } from "./workflows";
import { WorkflowSelector } from "./WorkflowSelector";

type CreateAnalysisProps = {
    /** The HMM search results */
    hmms: HMMSearchResults;
    /** The id of the sample being used */
    sampleId: string;
};

/**
 * Dialog for creating an analysis
 */
export default function CreateAnalysis({ hmms, sampleId }: CreateAnalysisProps) {
    const history = useHistory();
    const location = useLocation<{ createAnalysis: Workflows }>();
    const workflow = location.state?.createAnalysis;
    const open = Boolean(workflow);

    const createAnalysis = useCreateAnalysis();

    const { data: subtractionShortlist, isLoading: isLoadingSubtractionShortlist } =
        useFetchSubtractionsShortlist(true);
    const { data: sample, isLoading: isLoadingSample } = useFetchSample(sampleId);
    const { data: indexes, isLoading: isLoadingIndexes } = useListIndexes(true);
    const { data: mlModels, isLoading: isLoadingMLModels } = useFindModels();

    if (isLoadingMLModels || isLoadingSubtractionShortlist || isLoadingSample || isLoadingIndexes) {
        return null;
    }

    const dataType = sample.library_type === "amplicon" ? "barcode" : "genome";
    const defaultSubtractions = sample.subtractions.map(subtraction => subtraction.id);
    const subtractionOptions = map(keysIn(subtractionShortlist), key => {
        return {
            ...subtractionShortlist[key],
            isDefault: includes(defaultSubtractions, subtractionShortlist[key].id),
        };
    });
    const compatibleIndexes = map(groupBy(indexes, "reference.id"), group => maxBy(group, "version"));
    const compatibleWorkflows = getCompatibleWorkflows(dataType, Boolean(hmms.total_count));

    function onSubmit(props: CreateAnalysisFormValues) {
        const { indexes, subtractions, workflow, mlModel } = props;

        const references = map(
            filter(compatibleIndexes, index => indexes.includes(index.id)),
            "reference.id",
        );

        forEach(references, refId => {
            createAnalysis.mutate(
                { refId, subtractionIds: subtractions, sampleId, workflow, mlModel },
                { onSuccess: () => history.push({ state: { createAnalysis: false } }) },
            );
        });
    }

    function onChangeWorkflow(workflow: Workflows) {
        history.push({ state: { createAnalysis: workflow } });
    }

    return (
        <Dialog open={open} onOpenChange={open => history.push({ state: { createAnalysis: open } })}>
            <DialogPortal>
                <DialogOverlay />
                <CreateAnalysisDialogContent>
                    <DialogTitle>Analyze</DialogTitle>
                    <HMMAlert installed={hmms.status.task.complete} />
                    <WorkflowSelector
                        onSelect={onChangeWorkflow}
                        selected={location.state?.createAnalysis}
                        workflows={compatibleWorkflows}
                    />
                    <CreateAnalysisForm
                        compatibleIndexes={compatibleIndexes}
                        defaultSubtractions={defaultSubtractions}
                        mlModels={mlModels.items}
                        onSubmit={onSubmit}
                        sampleCount={1}
                        subtractions={subtractionOptions}
                        workflow={workflow}
                    />
                </CreateAnalysisDialogContent>
            </DialogPortal>
        </Dialog>
    );
}
