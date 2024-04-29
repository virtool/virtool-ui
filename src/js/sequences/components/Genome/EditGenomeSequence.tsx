import { DialogPortal } from "@radix-ui/react-dialog";
import { Field, Form, Formik, FormikErrors, FormikTouched } from "formik";
import { find } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { pushState } from "../../../app/actions";
import { Dialog, DialogOverlay, DialogTitle, SaveButton } from "../../../base";
import { getError } from "../../../errors/selectors";
import PersistForm from "../../../forms/components/PersistForm";
import { editSequence } from "../../../otus/actions";
import { getActiveIsolateId, getHasSchema, getOTUDetailId } from "../../../otus/selectors";
import { OTUSegment } from "../../../otus/types";
import { routerLocationHasState } from "../../../utils/utils";
import { getActiveSequence, getUnreferencedSegments } from "../../selectors";
import { SequenceForm, validationSchema } from "../SequenceForm";
import { StyledContent } from "./AddGenomeSequence";
import SegmentField from "./SegmentField";

function getInitialValues({ initialSegmentName, initialAccession, initialDefinition, initialHost, initialSequence }) {
    return {
        segment: initialSegmentName || null,
        accession: initialAccession || "",
        definition: initialDefinition || "",
        host: initialHost || "",
        sequence: initialSequence || "",
    };
}

export function castValues(segments: OTUSegment[]) {
    return function (values: formValues) {
        const segment = find(segments, { name: values.segment }) ? values.segment : null;
        return { ...values, segment };
    };
}

type formValues = {
    segment: string;
    accession: string;
    definition: string;
    host: string;
    sequence: string;
};

type EditGenomeSequenceProps = {
    hasSchema: boolean;
    initialAccession: string;
    initialDefinition: string;
    initialHost: string;
    initialSegmentName: string;
    initialSequence: string;
    /** A list of unreferenced segments */
    segments: OTUSegment[];
    id: string;
    isolateId: string;
    otuId: string;
    /** Indicates whether the dialog for editing a sequence is visible */
    show: boolean;
    /** A callback function to hide the dialog */
    onHide: () => void;
    /** A callback function to update the sequence */
    onSave: (
        otuId: string,
        isolateId: string,
        sequenceId: string,
        accession: string,
        definition: string,
        host: string,
        segment: string,
        sequence: string,
    ) => void;
};

/**
 * Displays dialog to edit a genome sequence
 */
export function EditGenomeSequence({
    hasSchema,
    initialAccession,
    initialDefinition,
    initialHost,
    initialSegmentName,
    initialSequence,
    segments,
    id,
    isolateId,
    otuId,
    show,
    onHide,
    onSave,
}: EditGenomeSequenceProps) {
    function handleSubmit({ accession, definition, host, sequence, segment }) {
        onSave(otuId, isolateId, id, accession, definition, host, segment, sequence);
    }

    const initialValues = getInitialValues({
        initialSegmentName,
        initialAccession,
        initialDefinition,
        initialHost,
        initialSequence,
    });

    return (
        <Dialog open={show} onOpenChange={onHide}>
            <DialogPortal>
                <DialogOverlay />
                <StyledContent>
                    <DialogTitle>Edit Sequence</DialogTitle>
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
                                <PersistForm
                                    formName={`editGenomeSequenceForm${id}`}
                                    castValues={castValues(segments)}
                                />
                                <Field
                                    as={SegmentField}
                                    name="segment"
                                    segments={segments}
                                    hasSchema={hasSchema}
                                    onChange={segment => {
                                        setFieldValue("segment", segment);
                                    }}
                                />
                                <SequenceForm touched={touched} errors={errors} />
                                <SaveButton />
                            </Form>
                        )}
                    </Formik>
                </StyledContent>
            </DialogPortal>
        </Dialog>
    );
}

export function mapStateToProps(state) {
    const { accession, definition, host, id, segment, sequence } = getActiveSequence(state);

    return {
        id,
        hasSchema: getHasSchema(state),
        initialAccession: accession,
        initialDefinition: definition,
        initialHost: host,
        initialSegmentName: segment,
        initialSequence: sequence,
        segments: getUnreferencedSegments(state),
        isolateId: getActiveIsolateId(state),
        otuId: getOTUDetailId(state),
        error: getError(state, "EDIT_SEQUENCE_ERROR"),
        show: routerLocationHasState(state, "editSequence"),
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        onHide: () => {
            dispatch(pushState({ addSequence: false, editSequence: false }));
        },

        onSave: (otuId, isolateId, sequenceId, accession, definition, host, segment, sequence) => {
            dispatch(
                editSequence({
                    otuId,
                    isolateId,
                    sequenceId,
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

export default connect(mapStateToProps, mapDispatchToProps)(EditGenomeSequence);
