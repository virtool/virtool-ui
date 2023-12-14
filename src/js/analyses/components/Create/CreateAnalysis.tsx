import { filter, forEach, map } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getAccountId } from "../../../account/selectors";
import { pushState } from "../../../app/actions";
import { Button, InputError, Modal, ModalBody, ModalFooter, ModalHeader } from "../../../base";
import { getDefaultSubtractions, getSampleDetailId, getSampleLibraryType } from "../../../samples/selectors";
import { getDataTypeFromLibraryType } from "../../../samples/utils";
import { shortlistSubtractions } from "../../../subtraction/actions";
import { routerLocationHasState } from "../../../utils/utils";
import { analyze } from "../../actions";
import { getAnalysesSubtractions, getCompatibleIndexesWithLibraryType } from "../../selectors";
import HMMAlert from "../HMMAlert";
import { CreateAnalysisSummary } from "./CreateAnalysisSummary";
import { useCreateAnalysis } from "./hooks";
import { IndexSelector } from "./IndexSelector";
import { SubtractionSelector } from "./SubtractionSelector";
import { getCompatibleWorkflows } from "./workflows";
import { WorkflowSelector } from "./WorkflowSelector";

const CreateAnalysisFooter = styled(ModalFooter)`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

const CreateAnalysisInputError = styled(InputError)`
    margin: -5px 0 5px;
`;

export const CreateAnalysis = ({
    accountId,
    compatibleIndexes,
    dataType,
    defaultSubtractions,
    hmms,
    sampleId,
    show,
    subtractionOptions,
    onAnalyze,
    onHide,
    onShortlistSubtractions,
}) => {
    useEffect(() => {
        if (show) {
            onShortlistSubtractions();
        }
    }, [show]);

    const { errors, indexes, subtractions, workflow, setErrors, setIndexes, setSubtractions, setWorkflow, reset } =
        useCreateAnalysis(dataType, defaultSubtractions);

    function handleSubmit(e) {
        e.preventDefault();

        const errors = {
            indexes: !indexes.length,
            workflow: !workflow,
        };

        if (errors.indexes || errors.workflow) {
            return setErrors(errors);
        }

        onAnalyze(
            sampleId,
            map(
                filter(compatibleIndexes, index => indexes.includes(index.id)),
                "reference.id",
            ),
            subtractions,
            accountId,
            workflow,
        );
        reset();
        onHide();
    }

    const compatibleWorkflows = getCompatibleWorkflows(dataType, Boolean(hmms.total_count));

    return (
        <Modal label="Analyze" show={show} size="lg" onHide={onHide}>
            <ModalHeader>Analyze</ModalHeader>
            <form onSubmit={handleSubmit}>
                <ModalBody>
                    <HMMAlert installed={hmms.status.task.complete} />
                    <WorkflowSelector workflows={compatibleWorkflows} selected={workflow} onSelect={setWorkflow} />
                    <CreateAnalysisInputError>
                        {errors.workflow && "A workflow must be selected"}
                    </CreateAnalysisInputError>
                    {dataType === "genome" && (
                        <SubtractionSelector
                            subtractions={subtractionOptions}
                            selected={subtractions}
                            onChange={setSubtractions}
                        />
                    )}
                    <IndexSelector indexes={compatibleIndexes} selected={indexes} onChange={setIndexes} />
                    <CreateAnalysisInputError>
                        {errors.indexes && "A reference must be selected"}
                    </CreateAnalysisInputError>
                </ModalBody>
                <CreateAnalysisFooter>
                    <CreateAnalysisSummary sampleCount={1} indexCount={indexes.length} workflowCount={1} />
                    <Button type="submit" color="blue" icon="play">
                        Start
                    </Button>
                </CreateAnalysisFooter>
            </form>
        </Modal>
    );
};

export function mapStateToProps(state) {
    return {
        accountId: getAccountId(state),
        compatibleIndexes: getCompatibleIndexesWithLibraryType(state),
        dataType: getDataTypeFromLibraryType(getSampleLibraryType(state)),
        defaultSubtractions: getDefaultSubtractions(state).map(subtraction => subtraction.id),
        sampleId: getSampleDetailId(state),
        show: routerLocationHasState(state, "createAnalysis"),
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
        onHide: () => {
            dispatch(pushState({}));
        },
        onShortlistSubtractions: () => {
            dispatch(shortlistSubtractions());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAnalysis);
