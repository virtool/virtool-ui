import { filter, forEach, map } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "../../../base";
import { getDefaultSubtractions, getSampleLibraryType } from "../../../samples/selectors";
import { getDataTypeFromLibraryType } from "../../../samples/utils";
import { shortlistSubtractions } from "../../../subtraction/actions";
import { routerLocationHasState } from "../../../utils/utils";
import { useAnalyze } from "../../querys";
import { getAnalysesSubtractions } from "../../selectors";
import HMMAlert from "../HMMAlert";
import { CreateAnalysisSummary } from "./CreateAnalysisSummary";
import { useCreateAnalysis } from "./hooks";
import { IndexSelector } from "./IndexSelector";
import { SubtractionSelector } from "./SubtractionSelector";
import { WorkflowSelector } from "./WorkflowSelector";

const CreateAnalysisFooter = styled(ModalFooter)`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

export function CreateAnalysis({
    compatibleIndexes,
    dataType,
    defaultSubtractions,
    hmms,
    sampleId,
    show,
    subtractionOptions,
    onShortlistSubtractions,
}) {
    const history = useHistory();
    const mutation = useAnalyze();

    function onAnalyze(references: string[], subtractionId: string[], workflows: string[]) {
        forEach(references, (refId: string) => {
            forEach(workflows, (workflow: string) =>
                mutation.mutate({
                    sampleId,
                    refId: refId,
                    subtractionIds: subtractionId,
                    workflow: workflow,
                }),
            );
        });
    }

    useEffect(() => {
        if (show) {
            onShortlistSubtractions();
        }
    }, [show]);

    function onHide() {
        history.push({ state: { quickAnalysis: false } });
    }

    const { errors, indexes, subtractions, workflows, setErrors, setIndexes, setSubtractions, setWorkflows } =
        useCreateAnalysis(dataType, defaultSubtractions);

    function handleSubmit(e) {
        e.preventDefault();

        const errors = {
            indexes: !indexes.length,
            workflows: !workflows.length,
        };

        if (errors.indexes || errors.workflows) {
            return setErrors(errors);
        }

        onAnalyze(
            map(
                filter(compatibleIndexes, index => indexes.includes(index.id)),
                "reference.id",
            ),
            subtractions,
            workflows,
        );
        onHide();
    }

    return (
        <Modal label="Analyze" show={show} size="lg" onHide={onHide}>
            <ModalHeader>Analyze</ModalHeader>
            <form onSubmit={handleSubmit}>
                <ModalBody>
                    <HMMAlert installed={hmms.status.task.complete} />
                    <WorkflowSelector
                        dataType={dataType}
                        hasError={errors.workflows}
                        hasHmm={Boolean(hmms.total_count)}
                        selected={workflows}
                        onSelect={setWorkflows}
                    />
                    {dataType === "genome" && (
                        <SubtractionSelector
                            subtractions={subtractionOptions}
                            selected={subtractions}
                            onChange={setSubtractions}
                        />
                    )}
                    <IndexSelector indexes={compatibleIndexes} selected={indexes} onChange={setIndexes} />
                </ModalBody>
                <CreateAnalysisFooter>
                    <CreateAnalysisSummary
                        sampleCount={1}
                        indexCount={indexes.length}
                        workflowCount={workflows.length}
                    />
                    <Button type="submit" color="blue" icon="play">
                        Start
                    </Button>
                </CreateAnalysisFooter>
            </form>
        </Modal>
    );
}

export function mapStateToProps(state) {
    return {
        dataType: getDataTypeFromLibraryType(getSampleLibraryType(state)),
        defaultSubtractions: getDefaultSubtractions(state).map(subtraction => subtraction.id),
        show: routerLocationHasState(state, "createAnalysis"),
        subtractionOptions: getAnalysesSubtractions(state),
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        onShortlistSubtractions: () => {
            dispatch(shortlistSubtractions());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAnalysis);
