import { Field, Form, Formik } from "formik";
import { find } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { pushState } from "../../../app/actions";
import { Modal, ModalBody, ModalFooter, ModalHeader, SaveButton } from "../../../base";
import { getError } from "../../../errors/selectors";
import PersistForm from "../../../forms/components/PersistForm";
import { editSequence } from "../../../otus/actions";
import { getActiveIsolateId, getOTUDetailId } from "../../../otus/selectors";
import { routerLocationHasState } from "../../../utils/utils";
import { getActiveSequence, getUnreferencedSegments } from "../../selectors";
import { SequenceForm, validationSchema } from "../Form";
import SegmentField from "./SegmentField";

const getInitialValues = ({ initialSegment, initialAccession, initialDefinition, initialHost, initialSequence }) => ({
    segment: initialSegment || null,
    accession: initialAccession || "",
    definition: initialDefinition || "",
    host: initialHost || "",
    sequence: initialSequence || ""
});

export const castValues = segments => values => {
    const segment = find(segments, { name: values.segment }) ? values.segment : null;
    return { ...values, segment };
};

export const EditGenomeSequence = ({
    initialAccession,
    initialDefinition,
    initialHost,
    initialSegment,
    initialSequence,
    segments,
    id,
    isolateId,
    otuId,
    show,
    onHide,
    onSave
}) => {
    const title = "Edit Sequence";

    const handleSubmit = ({ accession, definition, host, sequence, segment }) => {
        onSave(otuId, isolateId, id, accession, definition, host, segment, sequence);
    };

    const initialValues = getInitialValues({
        initialSegment,
        initialAccession,
        initialDefinition,
        initialHost,
        initialSequence
    });
    return (
        <Modal label={title} show={show} size="lg" onHide={onHide}>
            <ModalHeader>{title}</ModalHeader>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                {({ setFieldValue, errors, touched }) => (
                    <Form>
                        <ModalBody>
                            <PersistForm formName={`editGenomeSequenceForm${id}`} castValues={castValues(segments)} />
                            <Field
                                as={SegmentField}
                                name="segment"
                                onChange={segment => {
                                    setFieldValue("segment", segment);
                                }}
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
    const { accession, definition, host, id, segment, sequence } = getActiveSequence(state);

    return {
        id,
        initialAccession: accession,
        initialDefinition: definition,
        initialHost: host,
        initialSegment: segment,
        initialSequence: sequence,
        segments: getUnreferencedSegments(state),
        isolateId: getActiveIsolateId(state),
        otuId: getOTUDetailId(state),
        error: getError(state, "EDIT_SEQUENCE_ERROR"),
        show: routerLocationHasState(state, "editSequence")
    };
};

export const mapDispatchToProps = dispatch => ({
    onHide: () => {
        dispatch(pushState({ addSequence: false, editSequence: false }));
    },

    onSave: (otuId, isolateId, sequenceId, accession, definition, host, segment, sequence) => {
        dispatch(editSequence({ otuId, isolateId, sequenceId, accession, definition, host, sequence, segment }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditGenomeSequence);
