import { Dialog, DialogContent, DialogOverlay, DialogTitle, SaveButton } from "@base";
import { useAddSequence } from "@otus/queries";
import { OTUSegment, OTUSequence } from "@otus/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useLocationState } from "@utils/hooks";
import { Field, Form, Formik, FormikErrors, FormikTouched } from "formik";
import { merge } from "lodash";
import { find } from "lodash-es";
import { compact, map } from "lodash-es/lodash";
import React from "react";
import styled from "styled-components";
import PersistForm from "../../../forms/components/PersistForm";
import { SequenceForm, validationSchema } from "../SequenceForm";
import SegmentField from "./SegmentField";

const initialValues = { segment: null, accession: "", definition: "", host: "", sequence: "" };

export function castValues(segments: OTUSegment[]) {
    return function (values: formValues) {
        const segment = find(segments, { name: values.segment }) ? values.segment : null;
        return { ...values, segment };
    };
}

export const StyledContent = styled(DialogContent)`
    top: 50%;
`;

type formValues = {
    segment: string;
    accession: string;
    definition: string;
    host: string;
    sequence: string;
};

type AddGenomeSequenceProps = {
    isolateId: string;
    otuId: string;
    refId: string;
    schema: OTUSegment[];
    sequences: OTUSequence[];
};

/**
 * Displays dialog to add a genome sequence
 */
export default function AddGenomeSequence({ isolateId, otuId, refId, schema, sequences }: AddGenomeSequenceProps) {
    const [locationState, setLocationState] = useLocationState();
    const mutation = useAddSequence(otuId);

    const referencedSegmentNames = compact(map(sequences, "segment"));
    const segments = schema.filter(segment => !referencedSegmentNames.includes(segment.name));

    function handleSubmit({ accession, definition, host, sequence, segment }) {
        mutation.mutate(
            { isolateId, accession, definition, host, segment, sequence: sequence.toUpperCase() },
            {
                onSuccess: () => {
                    setLocationState(merge(locationState, { addSequence: false }));
                },
            },
        );
    }

    return (
        <Dialog
            open={locationState?.addSequence}
            onOpenChange={() => setLocationState(merge(locationState, { addSequence: false }))}
        >
            <DialogPortal>
                <DialogOverlay />
                <StyledContent>
                    <DialogTitle>Add Sequence</DialogTitle>
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
                                    hasSchema={schema.length > 0}
                                    onChange={(segment: string) => setFieldValue("segment", segment)}
                                    otuId={otuId}
                                    refId={refId}
                                    segments={segments}
                                />
                                <SequenceForm errors={errors} touched={touched} />
                                <SaveButton />
                            </Form>
                        )}
                    </Formik>
                </StyledContent>
            </DialogPortal>
        </Dialog>
    );
}
