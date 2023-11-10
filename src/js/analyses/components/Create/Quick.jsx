import { Field, Form, Formik } from "formik";
import { filter, forEach, uniqBy } from "lodash-es";
import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import {
    Badge,
    Button,
    Icon,
    InputError,
    LoadingPlaceholder,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTabs,
    TabsLink,
} from "../../../base";
import { useFindHmms } from "../../../hmm/querys";
import { useListReadyIndexes } from "../../../indexes/querys";
import { shortlistSubtractions } from "../../../subtraction/actions";
import { getReadySubtractionShortlist } from "../../../subtraction/selectors";
import { analyze } from "../../api";
import HMMAlert from "../HMMAlert";
import { CreateAnalysisSummary } from "./CreateAnalysisSummary";
import { IndexSelector } from "./IndexSelector";
import { SelectedSamples } from "./SelectedSamples";
import { SubtractionSelector } from "./SubtractionSelector";
import { WorkflowSelector } from "./WorkflowSelector";

const QuickAnalyzeFooter = styled(ModalFooter)`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

const QuickAnalyzeSelected = styled.span`
    align-self: center;
    margin: 0 15px 0 auto;
`;

const QuickAnalyzeError = styled(InputError)`
    margin: -5px 0px 0px;
`;

const initialValues = {
    workflows: [],
    subtractions: [],
    indexes: [],
};

const validationSchema = Yup.object().shape({
    workflows: Yup.array().min(1, "At least one workflow must be selected"),
    indexes: Yup.array().min(1, "At least one reference must be selected"),
});

export function quickAnalysisMode(libraryType, history) {
    if (history.location.state?.quickAnalysis === true) {
        if (libraryType === "amplicon") {
            return "barcode";
        }

        return "genome";
    }
}

export function getCompatibleSamples(mode, samples) {
    return filter(samples, sample => {
        if (mode === "barcode") {
            return sample.library_type === "amplicon";
        }

        return sample.library_type === "normal" || sample.library_type === "srna";
    });
}

export function QuickAnalyze({ samples, subtractionOptions, onShortlistSubtractions, onClear }) {
    const history = useHistory();
    const mode = quickAnalysisMode(samples.library_type, history);

    const show = Boolean(mode);
    const compatibleSamples = getCompatibleSamples(mode, samples);

    const { data: hmms, isLoading: isLoadingHmms } = useFindHmms();
    const { data: indexes, isLoading: isLoadingIndexes } = useListReadyIndexes();
    const mutation = useMutation(analyze);

    const barcode = samples.filter(sample => sample.library_type === "amplicon");
    const genome = samples.filter(sample => sample.library_type !== "amplicon");

    function onAnalyze(samples, references, subtractionId, workflows) {
        forEach(samples, ({ id }) => {
            forEach(references, refId => {
                forEach(workflows, workflow =>
                    mutation.mutate({
                        sampleId: id,
                        refId: refId,
                        subtractionIds: subtractionId,
                        workflow: workflow,
                    }),
                );
            });
        });
    }

    useEffect(() => {
        onShortlistSubtractions();
    }, [show]);

    function onHide() {
        history.push({ state: { quickAnalysis: false } });
    }

    // The dialog should close when all selected samples have been analyzed and deselected.
    useEffect(() => {
        if (show && compatibleSamples.length === 0) {
            onHide();
        }
    }, [mode]);

    if (isLoadingHmms || isLoadingIndexes) {
        return <LoadingPlaceholder />;
    }

    function referenceId(selectedIndexes) {
        const selectedCompatibleIndexes = indexes.filter(index => selectedIndexes.includes(index.id));

        const referenceIds = selectedCompatibleIndexes.map(index => index.reference.id);

        return uniqBy(referenceIds, "id");
    }

    function handleSubmit({ indexes, subtractions, workflows }) {
        const referenceIds = referenceId(indexes);

        onAnalyze(compatibleSamples, referenceIds, subtractions, workflows);
        onClear();
        onHide();
    }

    return (
        <Modal label="Quick Analyze" show={show} size="lg" onHide={onHide}>
            <ModalHeader>Quick Analyze</ModalHeader>
            <ModalTabs>
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
                <QuickAnalyzeSelected>{samples.length} samples selected</QuickAnalyzeSelected>
            </ModalTabs>

            <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema}>
                {({ errors, setFieldValue, touched, values }) => (
                    <Form>
                        <ModalBody>
                            {mode === "genome" && <HMMAlert />}
                            <SelectedSamples samples={compatibleSamples} />
                            <Field
                                as={WorkflowSelector}
                                dataType={mode ?? "genome"}
                                hasHmm={Boolean(hmms.total_count)}
                                selected={values.workflows}
                                onSelect={workflows => setFieldValue("workflows", workflows)}
                            />
                            <QuickAnalyzeError>{touched.workflows && errors.workflows}</QuickAnalyzeError>
                            {mode === "genome" && (
                                <>
                                    <Field
                                        as={SubtractionSelector}
                                        subtractions={subtractionOptions}
                                        selected={values.subtractions}
                                        onChange={value => setFieldValue("subtractions", value)}
                                    />

                                    <QuickAnalyzeError>{touched.subtractions && errors.subtractions}</QuickAnalyzeError>
                                </>
                            )}
                            <Field
                                as={IndexSelector}
                                indexes={indexes}
                                selected={values.indexes}
                                onChange={value => setFieldValue("indexes", value)}
                            />
                            <QuickAnalyzeError>{touched.indexes && errors.indexes}</QuickAnalyzeError>{" "}
                        </ModalBody>
                        <QuickAnalyzeFooter>
                            <CreateAnalysisSummary
                                indexCount={values.indexes.length}
                                sampleCount={compatibleSamples.length}
                                workflowCount={values.workflows.length}
                            />
                            <Button type="submit" color="blue" icon="play">
                                Start
                            </Button>
                        </QuickAnalyzeFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}

export function mapStateToProps(state) {
    return {
        subtractionOptions: getReadySubtractionShortlist(state),
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        onShortlistSubtractions: () => {
            dispatch(shortlistSubtractions());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(QuickAnalyze);
