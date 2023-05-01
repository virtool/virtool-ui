import { Field, Form, Formik } from "formik";
import { filter, forEach, map } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import * as Yup from "yup";
import { getAccountId } from "../../../account/selectors";
import { pushState } from "../../../app/actions";
import {
    Badge,
    Button,
    Icon,
    InputError,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTabs,
    TabsLink,
} from "../../../base";
import { deselectSamples } from "../../../samples/actions";
import { getSelectedSamples } from "../../../samples/selectors";
import { shortlistSubtractions } from "../../../subtraction/actions";
import { getReadySubtractionShortlist } from "../../../subtraction/selectors";
import { analyze } from "../../actions";
import {
    getCompatibleIndexesWithDataType,
    getCompatibleSamples,
    getQuickAnalysisGroups,
    getQuickAnalysisMode,
} from "../../selectors";
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
    subtractions: Yup.array().min(1, "At least one subtraction must be selected"),
    indexes: Yup.array().min(1, "At least one reference must be selected"),
});

export const QuickAnalyze = ({
    accountId,
    compatibleIndexes,
    compatibleSamples,
    barcode,
    genome,
    hasHmm,
    mode,
    samples,
    subtractionOptions,
    onAnalyze,
    onHide,
    onShortlistSubtractions,
    onUnselect,
}) => {
    const show = Boolean(mode);

    useEffect(() => {
        onShortlistSubtractions();
    }, [show]);

    // The dialog should close when all selected samples have been analyzed and deselected.
    useEffect(() => {
        if (show && compatibleSamples.length === 0) {
            onHide();
        }
    }, [mode]);

    // Use this as the subtraction if none is selected.
    // const firstSubtractionId = get(subtractionOptions, [0, "id"]);

    const handleSubmit = ({ indexes, subtractions, workflows }) => {
        const referenceIds = map(
            filter(compatibleIndexes, index => indexes.includes(index.id)),
            "reference.id",
        );
        onAnalyze(compatibleSamples, referenceIds, subtractions, accountId, workflows);
        onUnselect(compatibleSamples.map(sample => sample.id));
    };

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
                                dataType={mode || "genome"}
                                hasHmm={hasHmm}
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
                                indexes={compatibleIndexes}
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
};

export const mapStateToProps = state => ({
    ...getQuickAnalysisGroups(state),
    accountId: getAccountId(state),
    compatibleIndexes: getCompatibleIndexesWithDataType(state),
    compatibleSamples: getCompatibleSamples(state),
    hasHmm: Boolean(state.hmms.total_count),
    mode: getQuickAnalysisMode(state),
    samples: getSelectedSamples(state),
    subtractionOptions: getReadySubtractionShortlist(state),
});

export const mapDispatchToProps = dispatch => ({
    onAnalyze: (samples, references, subtractionId, accountId, workflows) => {
        forEach(samples, ({ id }) => {
            forEach(references, refId => {
                forEach(workflows, workflow => dispatch(analyze(id, refId, subtractionId, accountId, workflow)));
            });
        });
    },

    onHide: () => {
        dispatch(pushState({ quickAnalysis: false }));
    },

    onShortlistSubtractions: () => {
        dispatch(shortlistSubtractions());
    },

    onUnselect: sampleIds => {
        dispatch(deselectSamples(sampleIds));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(QuickAnalyze);
