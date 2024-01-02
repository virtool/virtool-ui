import { DialogPortal } from "@radix-ui/react-dialog";
import { Field, Form, Formik, FormikErrors, FormikTouched } from "formik";
import { find } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { pushState } from "../../../app/actions";
import { Dialog, DialogContent, DialogOverlay, DialogTitle, SaveButton } from "../../../base";
import PersistForm from "../../../forms/components/PersistForm";
import { addSequence } from "../../../otus/actions";
import { getActiveIsolateId, getOTUDetailId } from "../../../otus/selectors";
import { OTUSegment } from "../../../otus/types";
import { routerLocationHasState } from "../../../utils/utils";
import { getUnreferencedSegments } from "../../selectors";
import { SequenceForm, validationSchema } from "../SequenceForm";
import SegmentField from "./SegmentField";

const initialValues = { segment: null, accession: "", definition: "", host: "", sequence: "" };

type formValues = {
    segment: string;
    accession: string;
    definition: string;
    host: string;
    sequence: string;
};

export function castValues(segments: OTUSegment[]) {
    return function (values: formValues) {
        const segment = find(segments, { name: values.segment }) ? values.segment : null;
        return { ...values, segment };
    };
}

type AddGenomeSequenceProps = {
    isolateId: string;
    otuId: string;
    /** Indicates whether the dialog for editing a sequence is visible */
    show: boolean;
    /** A list of unreferenced segments */
    segments: OTUSegment[];
    /** A callback function to hide the dialog */
    onHide: () => void;
    /** A callback function to add the sequence */
    onSave: (
        otuId: string,
        isolateId: string,
        accession: string,
        definition: string,
        host: string,
        segment: string,
        sequence: string,
    ) => void;
};

/**
 * Displays dialog to add a genome sequence
 */
export function AddGenomeSequence({ isolateId, otuId, show, segments, onHide, onSave }: AddGenomeSequenceProps) {
    const title = "Add Sequence";

    function handleSubmit({ accession, definition, host, sequence, segment }) {
        onSave(otuId, isolateId, accession, definition, host, segment, sequence);
    }

    return (
        <Dialog open={show} onOpenChange={onHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>{title}</DialogTitle>
                    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                        {({
                            setFieldValue,
                            errors,
                            touched,
                        }: {
                            setFieldValue: (field: string, value: string) => void;
                            errors: FormikErrors<formValues>;
                            touched: FormikTouched<formValues>;
                        }) => (
                            <Form>
                                <PersistForm formName="addGenomeSequenceForm" castValues={castValues(segments)} />
                                <Field
                                    as={SegmentField}
                                    name="segment"
                                    onChange={(segment: string) => setFieldValue("segment", segment)}
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
}

export function mapStateToProps(state) {
    return {
        isolateId: getActiveIsolateId(state),
        otuId: getOTUDetailId(state),
        show: routerLocationHasState(state, "addSequence"),
        segments: getUnreferencedSegments(state),
    };
}

export function mapDispatchToProps(dispatch) {
    return {
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
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddGenomeSequence);
