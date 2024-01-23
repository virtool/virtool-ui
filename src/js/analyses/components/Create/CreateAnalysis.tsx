import { DialogPortal } from "@radix-ui/react-dialog";
import { filter, forEach, map } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { pushState } from "../../../app/actions";
import { Dialog, DialogOverlay, DialogTitle, LoadingPlaceholder } from "../../../base";
import { useFindModels } from "../../../ml/queries";
import { getDefaultSubtractions, getSampleDetailId, getSampleLibraryType } from "../../../samples/selectors";
import { getDataTypeFromLibraryType } from "../../../samples/utils";
import { shortlistSubtractions } from "../../../subtraction/actions";
import { routerLocationHasState } from "../../../utils/utils";
import { useCreateAnalysis } from "../../querys";
import { getAnalysesSubtractions, getCompatibleIndexesWithLibraryType } from "../../selectors";
import { Workflows } from "../../types";
import HMMAlert from "../HMMAlert";
import { CreateAnalysisDialogContent } from "./CreateAnalysisDialogContent";
import { CreateAnalysisForm, CreateAnalysisFormValues } from "./CreateAnalysisForm";
import { getCompatibleWorkflows } from "./workflows";
import { WorkflowSelector } from "./WorkflowSelector";

export const CreateAnalysis = ({
    compatibleIndexes,
    dataType,
    defaultSubtractions,
    hmms,
    sampleId,
    open,
    subtractionOptions,
    onSetOpen,
    onShortlistSubtractions,
}) => {
    const history = useHistory();
    const location = useLocation<{ createAnalysis: Workflows }>();
    const workflow = location.state?.createAnalysis;

    useEffect(() => {
        if (open) {
            onShortlistSubtractions();
        }
    }, [open]);

    const createAnalysis = useCreateAnalysis();

    const { data: mlModels, isLoading } = useFindModels();

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

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
                { onSuccess: () => onSetOpen(false) },
            );
        });
    }

    function onChangeWorkflow(workflow: Workflows) {
        history.push({ state: { createAnalysis: workflow } });
    }

    return (
        <Dialog open={open} onOpenChange={open => onSetOpen(open)}>
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
};

export function mapStateToProps(state) {
    return {
        compatibleIndexes: getCompatibleIndexesWithLibraryType(state),
        dataType: getDataTypeFromLibraryType(getSampleLibraryType(state)),
        defaultSubtractions: getDefaultSubtractions(state).map(subtraction => subtraction.id),
        sampleId: getSampleDetailId(state),
        open: routerLocationHasState(state, "createAnalysis"),
        subtractionOptions: getAnalysesSubtractions(state),
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        onSetOpen: open => {
            dispatch(pushState({ createAnalysis: open }));
        },
        onShortlistSubtractions: () => {
            dispatch(shortlistSubtractions());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAnalysis);
