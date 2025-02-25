import { SaveButton } from "@base";
import { RestoredAlert } from "@forms/components/RestoredAlert";
import { usePersistentForm } from "@forms/hooks";
import { OTUSegment, OTUSequence } from "@otus/types";
import SequenceSegmentField from "@sequences/components/Genome/SequenceSegmentField";
import React from "react";
import { FormProvider } from "react-hook-form";
import { SequenceForm } from "../SequenceForm";

type FormValues = {
    segment: string;
    accession: string;
    definition: string;
    host: string;
    sequence: string;
};

type GenomeSequenceFormProps = {
    activeSequence?: OTUSequence;
    hasSchema: boolean;
    /** Whether the form is of type edit or add */
    noun: string;
    /** A callback function to add/edit a genome sequence  */
    onSubmit: (formValues: FormValues) => void;
    otuId: string;
    refId: string;
    /** A list of unreferenced segments */
    segments: OTUSegment[];
};

/**
 * A form for creating or editing a genome sequence
 */
export default function GenomeSequenceForm({
    activeSequence,
    hasSchema,
    noun,
    onSubmit,
    otuId,
    refId,
    segments,
}: GenomeSequenceFormProps) {
    const { accession, definition, host, id, segment, sequence } =
        activeSequence || {};
    const methods = usePersistentForm<FormValues>({
        formName: `${noun}GenomeSequence${id}`,
        defaultValues: {
            segment: segment || null,
            accession: accession || "",
            definition: definition || "",
            host: host || "",
            sequence: sequence || "",
        },
    });

    const { handleSubmit, hasRestored, reset } = methods;

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <RestoredAlert
                    hasRestored={hasRestored}
                    name="sequence"
                    resetForm={reset}
                />
                <SequenceSegmentField
                    hasSchema={hasSchema}
                    otuId={otuId}
                    refId={refId}
                    segments={segments}
                />
                <SequenceForm />
                <SaveButton />
            </form>
        </FormProvider>
    );
}
