import { Dialog, DialogOverlay, DialogTitle, SaveButton } from "@base";
import { useEditSequence } from "@otus/queries";
import { OTUSegment, OTUSequence } from "@otus/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useLocationState } from "@utils/hooks";
import { Field, Form, Formik, FormikErrors, FormikTouched } from "formik";
import { find } from "lodash-es";
import React from "react";
import PersistForm from "../../../forms/components/PersistForm";
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
    activeSequence: OTUSequence;
    hasSchema: boolean;
    /** A list of unreferenced segments */
    segments: OTUSegment[];
    isolateId: string;
    otuId: string;
    refId: string;
};

/**
 * Displays dialog to edit a genome sequence
 */
export default function EditGenomeSequence({
    activeSequence,
    hasSchema,
    segments,
    isolateId,
    otuId,
    refId,
}: EditGenomeSequenceProps) {
    const [locationState, setLocationState] = useLocationState();
    const mutation = useEditSequence(otuId);
    const { accession, definition, host, id, segment, sequence } = activeSequence;

    function handleSubmit({ accession, definition, host, sequence, segment }) {
        mutation.mutate({ isolateId, sequenceId: id, accession, definition, host, segment, sequence });
    }

    const initialValues = getInitialValues({
        initialSegmentName: segment,
        initialAccession: accession,
        initialDefinition: definition,
        initialHost: host,
        initialSequence: sequence,
    });

    return (
        <Dialog open={locationState?.editSequence} onOpenChange={() => setLocationState({ editSequence: false })}>
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
                                    otuId={otuId}
                                    refId={refId}
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
