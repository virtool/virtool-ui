import { DialogPortal } from "@radix-ui/react-dialog";
import { filter, forEach, map } from "lodash-es";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { connect } from "react-redux";
import styled, { keyframes } from "styled-components";
import { pushState } from "../../../app/actions";
import {
    Button,
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogTitle,
    LoadingPlaceholder,
    ModalFooter,
} from "../../../base";
import { useFindModels } from "../../../ml/queries";
import { getDefaultSubtractions, getSampleDetailId, getSampleLibraryType } from "../../../samples/selectors";
import { getDataTypeFromLibraryType } from "../../../samples/utils";
import { shortlistSubtractions } from "../../../subtraction/actions";
import { routerLocationHasState } from "../../../utils/utils";
import { useCreateAnalysis } from "../../querys";
import { getAnalysesSubtractions, getCompatibleIndexesWithLibraryType } from "../../selectors";
import HMMAlert from "../HMMAlert";
import { CreateAnalysisSummary } from "./CreateAnalysisSummary";
import { IndexSelector } from "./IndexSelector";
import { MLModelSelector } from "./MLModelSelector";
import { SubtractionSelector } from "./SubtractionSelector";
import { getCompatibleWorkflows, getRequiredResources } from "./workflows";
import { WorkflowSelector } from "./WorkflowSelector";

const createAnalysisOpen = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -2%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0%) scale(1);
  }
`;

const CreateAnalysisFooter = styled(ModalFooter)`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-top: auto;

    button {
        margin-left: auto;
    }
`;

const CreateAnalysisDialogContent = styled(DialogContent)`
    animation: ${createAnalysisOpen} 150ms cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 5%;
    transform: translate(-50%, 0%);
    width: 700px;

    form {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
`;

type createAnalysisFormValues = {
    indexes?: string[];
    subtractions?: string[];
    mlModel?: string;
};

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
    console.log(defaultSubtractions);

    useEffect(() => {
        if (open) {
            onShortlistSubtractions();
        }
    }, [open]);

    const createAnalysis = useCreateAnalysis();

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<createAnalysisFormValues>({
        defaultValues: { subtractions: defaultSubtractions },
    });

    const { data: mlModels, isLoading } = useFindModels();

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const compatibleWorkflows = getCompatibleWorkflows(dataType, Boolean(hmms.total_count));
    const requiredResources = getRequiredResources(watch("workflow"));

    function onSubmit(props) {
        console.log(props);
        const { indexes, subtractions, workflow, mlModel } = props as createAnalysisFormValues;

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

        return;
    }

    return (
        <Dialog open={open} onOpenChange={open => onSetOpen(open)}>
            <DialogPortal>
                <DialogOverlay />
                <CreateAnalysisDialogContent>
                    <DialogTitle>Analyze</DialogTitle>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <HMMAlert installed={hmms.status.task.complete} />
                        <Controller
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <WorkflowSelector
                                    workflows={compatibleWorkflows}
                                    selected={value}
                                    onSelect={onChange}
                                />
                            )}
                            name="workflow"
                        />
                        <CreateAnalysisInputError>
                            {errors.workflow && "A workflow must be selected"}
                        </CreateAnalysisInputError>
                        {requiredResources.subtraction && (
                            <>
                                <Controller
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <SubtractionSelector
                                            subtractions={subtractionOptions}
                                            selected={value}
                                            onChange={onChange}
                                        />
                                    )}
                                    name={"subtractions"}
                                    defaultValue={[]}
                                    shouldUnregister
                                />
                            </>
                        )}
                        {requiredResources.reference && (
                            <>
                                <Controller
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <IndexSelector
                                            indexes={compatibleIndexes}
                                            selected={value}
                                            onChange={onChange}
                                        />
                                    )}
                                    name="indexes"
                                    defaultValue={[]}
                                    rules={{ required: true }}
                                    shouldUnregister
                                />
                                <CreateAnalysisInputError>
                                    {errors.indexes && "A reference must be selected"}
                                </CreateAnalysisInputError>
                            </>
                        )}
                        {requiredResources.ml && (
                            <>
                                <Controller
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <MLModelSelector models={mlModels.items} selected={value} onChange={onChange} />
                                    )}
                                    name="mlModel"
                                    rules={{ required: true }}
                                    shouldUnregister
                                />
                                <CreateAnalysisInputError>
                                    {errors.mlModel && "A ml model must be selected"}
                                </CreateAnalysisInputError>
                            </>
                        )}

                        <CreateAnalysisFooter>
                            <CreateAnalysisSummary sampleCount={1} indexCount={watch("indexes")?.length ?? 0} />
                            <Button type="submit" color="blue" icon="play">
                                Start
                            </Button>
                        </CreateAnalysisFooter>
                    </form>
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
