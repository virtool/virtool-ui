import { DialogPortal } from "@radix-ui/react-dialog";
import { Field, Form, Formik } from "formik";
import { find } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { pushState } from "../../../app/actions";
import { Dialog, DialogContent, DialogOverlay, DialogTitle, SaveButton } from "../../../base";
import PersistForm from "../../../forms/components/PersistForm";
import { addSequence } from "../../../otus/actions";
import { getActiveIsolateId, getOTUDetailId } from "../../../otus/selectors";
import { routerLocationHasState } from "../../../utils/utils";
import { getUnreferencedSegments } from "../../selectors";
import { SequenceForm, validationSchema } from "../Form";
import SegmentField from "./SegmentField";

const initialValues = { segment: undefined, accession: "", definition: "", host: "", sequence: "" };

export const castValues = segments => values => {
    const segment = find(segments, { name: values.segment }) ? values.segment : undefined;
    return { ...values, segment };
};

export const AddGenomeSequence = ({ isolateId, otuId, show, segments, onHide, onSave }) => {
    const title = "Add Sequence";

    const handleSubmit = ({ accession, definition, host, sequence, segment }) => {
        onSave(otuId, isolateId, accession, definition, host, segment, sequence);
    };

    return (
        <Dialog open={show} onOpenChange={onHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>{title}</DialogTitle>
                    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                        {({ setFieldValue, errors, touched }) => (
                            <Form>
                                <PersistForm formName="addGenomeSequenceForm" castValues={castValues(segments)} />
                                <Field
                                    as={SegmentField}
                                    name="segment"
                                    onChange={segment => setFieldValue("segment", segment)}
                                />
                                <SequenceForm errors={errors} touched={touched} />
                                <SaveButton />
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
};

export const mapStateToProps = state => ({
    isolateId: getActiveIsolateId(state),
    otuId: getOTUDetailId(state),
    show: routerLocationHasState(state, "addSequence"),
    segments: getUnreferencedSegments(state),
});

export const mapDispatchToProps = dispatch => ({
    onHide: () => {
        dispatch(pushState({ addSequence: false }));
    },
    onSave: (otuId, isolateId, accession, definition, host, segment, sequence) => {
        dispatch(
            addSequence({
                otuId,
                isolateId,
                accession,
                definition,
                host,
                sequence,
                segment,
            }),
        );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddGenomeSequence);
