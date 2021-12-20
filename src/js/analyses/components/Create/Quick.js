import { forEach } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getAccountId } from "../../../account/selectors";
import { pushState } from "../../../app/actions";
import {
    Badge,
    Button,
    Icon,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTabs,
    TabLink,
    InputError
} from "../../../base";
import { deselectSamples } from "../../../samples/actions";
import { getSelectedSamples } from "../../../samples/selectors";
import { shortlistSubtractions } from "../../../subtraction/actions";
import { analyze } from "../../actions";
import {
    getCompatibleIndexesWithDataType,
    getCompatibleSamples,
    getQuickAnalysisGroups,
    getQuickAnalysisMode
} from "../../selectors";
import HMMAlert from "../HMMAlert";
import { ReferenceSelector } from "./ReferenceSelector";
import { SelectedSamples } from "./SelectedSamples";
import { SubtractionSelector } from "./SubtractionSelector";
import { CreateAnalysisSummary } from "./Summary";
import { WorkflowSelector } from "./WorkflowSelector";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

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
    references: []
};

const validationSchema = Yup.object().shape({
    workflows: Yup.array().min(1, "At least one workflow must be selected"),
    subtractions: Yup.array().min(1, "At least one subtraction must be selected"),
    references: Yup.array().min(1, "At least one reference must be selected")
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
    onUnselect
}) => {
    const show = !!mode;

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

    const handleSubmit = ({ references, subtractions, workflows }) => {
        onAnalyze(compatibleSamples, references, subtractions, accountId, workflows);
        onUnselect(compatibleSamples.map(sample => sample.id));
    };

    return (
        <Modal label="Quick Analyze" show={show} size="lg" onHide={onHide}>
            <ModalHeader>Quick Analyze</ModalHeader>
            <ModalTabs>
                {genome.length > 0 && (
                    <TabLink to={{ state: { quickAnalysis: "genome" } }} isActive={() => mode === "genome"}>
                        <Icon name="dna" /> Genome <Badge>{genome.length}</Badge>
                    </TabLink>
                )}
                {barcode.length > 0 && (
                    <TabLink to={{ state: { quickAnalysis: "barcode" } }} isActive={() => mode === "barcode"}>
                        <Icon name="barcode" /> Barcode <Badge>{barcode.length}</Badge>
                    </TabLink>
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
                                workflows={values.workflows}
                                onSelect={workflows => setFieldValue("workflows", workflows)}
                            />
                            <QuickAnalyzeError>{touched.workflows && errors.workflows}</QuickAnalyzeError>
                            {mode === "genome" && (
                                <>
                                    <Field
                                        as={SubtractionSelector}
                                        subtractions={subtractionOptions}
                                        value={values.subtractions}
                                        onChange={value => setFieldValue("subtractions", value)}
                                    />

                                    <QuickAnalyzeError>{touched.subtractions && errors.subtractions}</QuickAnalyzeError>
                                </>
                            )}
                            <Field
                                as={ReferenceSelector}
                                indexes={compatibleIndexes}
                                selected={values.references}
                                onChange={value => setFieldValue("references", value)}
                            />
                            <QuickAnalyzeError>{touched.references && errors.references}</QuickAnalyzeError>{" "}
                        </ModalBody>
                        <QuickAnalyzeFooter>
                            <CreateAnalysisSummary
                                indexCount={values.references.length}
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
    hasHmm: !!state.hmms.total_count,
    mode: getQuickAnalysisMode(state),
    samples: getSelectedSamples(state),
    subtractionOptions: state.subtraction.shortlist
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
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(QuickAnalyze);
