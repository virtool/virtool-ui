import { Field, Form, Formik } from "formik";
import { find } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { pushState } from "../../../app/actions";
import { Modal, ModalBody, ModalFooter, ModalHeader, SaveButton } from "../../../base";
import PersistForm from "../../../forms/components/PersistForm";
import { addSequence } from "../../../otus/actions";
import { getActiveIsolateId, getOTUDetailId } from "../../../otus/selectors";
import { getDefaultTargetName, getUnreferencedTargets } from "../../selectors";
import { SequenceForm, validationSchema } from "../Form";
import TargetsField from "./TargetField";

const getInitialValues = defaultTarget => ({
    targetName: defaultTarget,
    accession: "",
    definition: "",
    host: "",
    sequence: "",
});

export const castValues = (targets, defaultTarget) => values => {
    const targetName = find(targets, { name: values.targetName }) ? values.targetName : defaultTarget;
    return { ...values, targetName };
};

export const AddBarcodeSequence = ({ defaultTarget, isolateId, otuId, show, onHide, onSave, targets }) => {
    const title = "Add Sequence";

    const handleSubmit = ({ accession, definition, host, sequence, targetName }) => {
        onSave(otuId, isolateId, accession, definition, host, sequence, targetName);
    };

    const initialValues = getInitialValues(defaultTarget);

    return (
        <Modal label={title} show={show} size="lg" onHide={onHide}>
            <ModalHeader>{title}</ModalHeader>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                {({ errors, touched, setFieldValue }) => (
                    <Form>
                        <ModalBody>
                            <PersistForm
                                formName="addGenomeSequenceForm"
                                castValues={castValues(targets, defaultTarget)}
                            />
                            <Field
                                as={TargetsField}
                                name="targetName"
                                onChange={target => setFieldValue("targetName", target)}
                            />
                            <SequenceForm touched={touched} errors={errors} />
                        </ModalBody>
                        <ModalFooter>
                            <SaveButton />
                        </ModalFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export const mapStateToProps = state => ({
    defaultTarget: getDefaultTargetName(state),
    isolateId: getActiveIsolateId(state),
    otuId: getOTUDetailId(state),
    targets: getUnreferencedTargets(state),
});

export const mapDispatchToProps = dispatch => ({
    onHide: () => {
        dispatch(pushState({ addSequence: false }));
    },

    onSave: (otuId, isolateId, accession, definition, host, sequence, target) => {
        dispatch(addSequence({ otuId, isolateId, accession, definition, host, sequence, target }));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddBarcodeSequence);
