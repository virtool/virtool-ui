import { DialogPortal } from "@radix-ui/react-dialog";
import { forEach } from "lodash-es";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { connect } from "react-redux";
import styled from "styled-components";
import { getAccountId } from "../../../account/selectors";
import { pushState } from "../../../app/actions";
import { Button, Dialog, DialogContent, DialogTitle, InputError, LoadingPlaceholder, ModalFooter } from "../../../base";
import { useFindModels } from "../../../ml/queries";
import { getDefaultSubtractions, getSampleDetailId, getSampleLibraryType } from "../../../samples/selectors";
import { getDataTypeFromLibraryType } from "../../../samples/utils";
import { shortlistSubtractions } from "../../../subtraction/actions";
import { routerLocationHasState } from "../../../utils/utils";
import { analyze } from "../../actions";
import { getAnalysesSubtractions, getCompatibleIndexesWithLibraryType } from "../../selectors";
import { Workflows } from "../../types";
import HMMAlert from "../HMMAlert";
import { IndexSelector } from "./IndexSelector";
import { MLModelSelector } from "./MLModelSelector";
import { SubtractionSelector } from "./SubtractionSelector";
import { getCompatibleWorkflows, getRequiredResources } from "./workflows";
import { WorkflowSelector } from "./WorkflowSelector";

const CreateAnalysisFooter = styled(ModalFooter)`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-top: auto;

    button {
        margin-left: auto;
    }
`;

const CreateAnalysisInputError = styled(InputError)`
    margin: -20px 0 5px;
`;

const CreateAnalysisDialogContent = styled(DialogContent)`
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 5%;
    transform: translatex(-50%);
    overflow: auto;
    width: 700px;

    form {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
`;

type createStandardAnalysisFormValues = {
    workflow: Workflows.pathoscope_bowtie | Workflows.nuvs;
    indexes: string[];
    subtractions: string[];
};

type createMLAnalysisFormValues = {
    workflow: Workflows.iimi;
    mlModel: string[];
};

type createAnalysisFormValues = createStandardAnalysisFormValues & createMLAnalysisFormValues;

export const CreateAnalysis = ({
    accountId,
    compatibleIndexes,
    dataType,
    defaultSubtractions,
    hmms,
    sampleId,
    open,
    subtractionOptions,
    onAnalyze,
    onHide,
    onSetOpen,
    onShortlistSubtractions,
}) => {
    open = true;
    useEffect(() => {
        if (open) {
            onShortlistSubtractions();
        }
    }, [open]);

    // const { errors, indexes, subtractions, workflow, setErrors, setIndexes, setSubtractions, setWorkflow, reset } =
    //     useCreateAnalysis(dataType, defaultSubtractions);

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<createStandardAnalysisFormValues>({ defaultValues: { workflow: Workflows.iimi } });

    const { data: mlModels, isLoading } = useFindModels();

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const compatibleWorkflows = getCompatibleWorkflows(dataType, Boolean(hmms.total_count));
    const requiredResources = getRequiredResources(watch("workflow"));

    function onSubmit(props) {
        console.log(props);
        // onAnalyze(
        //     sampleId,
        //     map(
        //         filter(compatibleIndexes, index => indexes.includes(index.id)),
        //         "reference.id",
        //     ),
        //     subtractions,
        //     accountId,
        //     workflow,
        // );
        // reset();
        // onHide();
    }

    return (
        <Dialog open={open} onOpenChange={open => onSetOpen(open)}>
            <DialogPortal>
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
                            {/*<CreateAnalysisSummary sampleCount={1} indexCount={watch("indexes")?.length ?? 0} />*/}
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
        accountId: getAccountId(state),
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
        onAnalyze: (sampleId, references, subtractionIds, accountId, workflow) => {
            forEach(references, refId => {
                dispatch(analyze(sampleId, refId, subtractionIds, accountId, workflow));
            });
        },
        onSetOpen: open => {
            dispatch(pushState({ createAnalysis: open }));
        },
        onShortlistSubtractions: () => {
            dispatch(shortlistSubtractions());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAnalysis);
