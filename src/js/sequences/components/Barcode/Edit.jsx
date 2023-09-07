import { Field, Form, Formik } from "formik";
import { find } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { pushState } from "../../../app/actions";
import { Modal, ModalBody, ModalFooter, ModalHeader, SaveButton } from "../../../base";
import PersistForm from "../../../forms/components/PersistForm";
import { editSequence } from "../../../otus/actions";
import { getActiveIsolateId, getOTUDetailId } from "../../../otus/selectors";
import { routerLocationHasState } from "../../../utils/utils";
import { getActiveSequence, getUnreferencedTargets } from "../../selectors";
import { SequenceForm, validationSchema } from "../Form";
import TargetsField from "./TargetField";

const getInitialValues = ({
    initialTargetName,
    initialAccession,
    initialDefinition,
    initialHost,
    initialSequence,
}) => ({
    targetName: initialTargetName || null,
    accession: initialAccession || "",
    definition: initialDefinition || "",
    host: initialHost || "",
    sequence: initialSequence || "",
});

export const castValues = (targets, initialTargetName) => values => {
    const targetName = find(targets, { name: values.targetName }) ? values.targetName : initialTargetName;
    return { ...values, targetName };
};

export const EditBarcodeSequence = ({
    id,
    initialAccession,
    initialDefinition,
    initialHost,
    initialSequence,
    initialTargetName,
    targets,
    isolateId,
    otuId,
    show,
    onHide,
    onSave,
}) => {
    const title = "Edit Sequence";

    const handleSubmit = ({ accession, definition, host, sequence, targetName }) => {
        onSave(otuId, isolateId, id, accession, definition, host, sequence, targetName);
    };

    const initialValues = getInitialValues({
        initialTargetName,
        initialAccession,
        initialDefinition,
        initialHost,
        initialSequence,
    });

    return (
        <Modal label={title} show={show} size="lg" onHide={onHide}>
            <ModalHeader>{title}</ModalHeader>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                {({ touched, errors, setFieldValue }) => (
                    <Form>
                        <PersistForm
                            formName={`editGenomeSequenceForm${id}`}
                            castValues={castValues(targets, initialTargetName)}
                        />
                        <ModalBody>
                            <Field
                                as={TargetsField}
                                name="targetName"
                                onChange={targetName => setFieldValue("targetName", targetName)}
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

export const mapStateToProps = state => {
    const { accession, definition, host, id, sequence, target } = getActiveSequence(state);

    return {
        id,
        initialAccession: accession,
        initialDefinition: definition,
        initialHost: host,
        initialSequence: sequence,
        initialTargetName: target,
        targets: getUnreferencedTargets(state),
        isolateId: getActiveIsolateId(state),
        otuId: getOTUDetailId(state),
        show: routerLocationHasState(state, "editSequence"),
    };
};

export const mapDispatchToProps = dispatch => ({
    onSave: (otuId, isolateId, sequenceId, accession, definition, host, sequence, target) => {
        dispatch(editSequence({ otuId, isolateId, sequenceId, accession, definition, host, sequence, target }));
    },

    onHide: () => {
        dispatch(pushState({ editSequence: false }));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditBarcodeSequence);
