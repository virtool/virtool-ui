import { Workflows } from "@/analyses/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useUrlSearchParam } from "@utils/hooks";
import { groupBy, map, maxBy } from "lodash-es";
import { includes, keysIn } from "lodash-es/lodash";
import React from "react";
import { Dialog, DialogOverlay, DialogTitle } from "../../../base";
import { HMMSearchResults } from "../../../hmm/types";
import { useListIndexes } from "../../../indexes/queries";
import { useFindModels } from "../../../ml/queries";
import { useFetchSample } from "../../../samples/queries";
import { useFetchSubtractionsShortlist } from "../../../subtraction/queries";
import { useCreateAnalysis } from "../../queries";
import HMMAlert from "../HMMAlert";
import { CreateAnalysisDialogContent } from "./CreateAnalysisDialogContent";
import {
    CreateAnalysisForm,
    CreateAnalysisFormValues,
} from "./CreateAnalysisForm";
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
export default function CreateAnalysis({
    hmms,
    sampleId,
}: CreateAnalysisProps) {
    const {
        value: createAnalysisType,
        setValue: setCreateAnalysisType,
        unsetValue: unsetCreateAnalysisType,
    } = useUrlSearchParam<string>("createAnalysisType");

    const createAnalysis = useCreateAnalysis();

    const {
        data: subtractionShortlist,
        isPending: isPendingSubtractionShortlist,
    } = useFetchSubtractionsShortlist(true);
    const { data: sample, isPending: isPendingSample } =
        useFetchSample(sampleId);
    const { data: indexes, isPending: isPendingIndexes } = useListIndexes(true);
    const { data: mlModels, isPending: isPendingMLModels } = useFindModels();

    if (
        isPendingMLModels ||
        isPendingSubtractionShortlist ||
        isPendingSample ||
        isPendingIndexes
    ) {
        return null;
    }

    const dataType = sample.library_type === "amplicon" ? "barcode" : "genome";
    const defaultSubtractions = sample.subtractions.map(
        (subtraction) => subtraction.id,
    );
    const subtractionOptions = map(keysIn(subtractionShortlist), (key) => {
        return {
            ...subtractionShortlist[key],
            isDefault: includes(
                defaultSubtractions,
                subtractionShortlist[key].id,
            ),
        };
    });
    const compatibleIndexes = map(groupBy(indexes, "reference.id"), (group) =>
        maxBy(group, "version"),
    );
    const compatibleWorkflows = getCompatibleWorkflows(
        dataType,
        Boolean(hmms.total_count),
    );

    function onSubmit(props: CreateAnalysisFormValues) {
        const { index, subtractions, workflow, mlModel } = props;
        const refId = compatibleIndexes.find(
            (compatibleIndex) => compatibleIndex.reference.name === index,
        )?.reference.id;

        createAnalysis.mutate({
            refId,
            subtractionIds: subtractions,
            sampleId,
            workflow,
            mlModel,
        });
    }

    function onOpenChange(open) {
        if (!open) {
            unsetCreateAnalysisType();
        }
    }

    return (
        <Dialog
            open={includes(Workflows, createAnalysisType)}
            onOpenChange={onOpenChange}
        >
            <DialogPortal>
                <DialogOverlay />
                <CreateAnalysisDialogContent>
                    <DialogTitle>Analyze</DialogTitle>
                    <HMMAlert installed={hmms.status.task?.complete} />
                    <WorkflowSelector
                        onSelect={setCreateAnalysisType}
                        selected={createAnalysisType}
                        workflows={compatibleWorkflows}
                    />
                    <CreateAnalysisForm
                        compatibleIndexes={compatibleIndexes}
                        defaultSubtractions={defaultSubtractions}
                        mlModels={mlModels.items}
                        onSubmit={onSubmit}
                        sampleCount={1}
                        subtractions={subtractionOptions}
                        workflow={Workflows[createAnalysisType]}
                    />
                </CreateAnalysisDialogContent>
            </DialogPortal>
        </Dialog>
    );
}
