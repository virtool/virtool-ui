import { Dialog, DialogContent, DialogOverlay, DialogTitle, SaveButton } from "@base";
import { OTUQueryKeys, useAddSequence } from "@otus/queries";
import { OTUSegment, OTUSequence } from "@otus/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik, FormikErrors, FormikTouched } from "formik";
import { find } from "lodash-es";
import { compact, map } from "lodash-es/lodash";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
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
    sequences: OTUSequence[];
    schema: OTUSegment[];
};

/**
 * Displays dialog to add a genome sequence
 */
export default function AddGenomeSequence({ isolateId, otuId, sequences, schema }: AddGenomeSequenceProps) {
    const history = useHistory();
    const location = useLocation<{ addSequence: boolean }>();
    const mutation = useAddSequence();
    const queryClient = useQueryClient();

    const referencedSegmentNames = compact(map(sequences, "segment"));
    const segments = schema.filter(segment => !referencedSegmentNames.includes(segment.name));

    function handleSubmit({ accession, definition, host, sequence, segment }) {
        mutation.mutate(
            { otuId, isolateId, accession, definition, host, segment, sequence: sequence.toUpperCase() },
            {
                onSuccess: () => {
                    history.push({ state: { addSequence: false } });
                    queryClient.invalidateQueries(OTUQueryKeys.detail(otuId));
                },
                onError: error => {
                    console.log(error);
                },
            },
        );
    }

    return (
        <Dialog open={location.state?.addSequence} onOpenChange={() => history.push({ state: { addSequence: false } })}>
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
                                    segments={segments}
                                    hasSchema={schema.length > 0}
                                    onChange={(segment: string) => setFieldValue("segment", segment)}
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
