import {
    InputError,
    InputGroup,
    InputLabel,
    InputSimple,
    SaveButton,
} from "@base";
import { RestoredAlert } from "@forms/components/RestoredAlert";
import { usePersistentForm } from "@forms/hooks";
import { OTUSegment, OTUSequence } from "@otus/types";
import SequenceField from "@sequences/components/SequenceField";
import SequenceSegmentField from "@sequences/components/SequenceSegmentField";
import React from "react";
import { FormProvider } from "react-hook-form";
import Accession from "./Accession";

type SequenceFormValues = {
    accession: string;
    definition: string;
    host: string;
    segment: string;
    sequence: string;
};

type SequenceFormProps = {
    activeSequence?: OTUSequence;
    hasSchema: boolean;
    /** Whether the form is of type edit or add */
    noun: string;

    /** A callback function to add/edit a genome sequence  */
    onSubmit: (formValues: SequenceFormValues) => void;

    otuId: string;
    refId: string;

    /** A list of unreferenced segments */
    segments: OTUSegment[];
};

/**
 * A form for creating or editing a genome sequence
 */
export default function SequenceForm({
    activeSequence,
    hasSchema,
    noun,
    onSubmit,
    otuId,
    refId,
    segments,
}: SequenceFormProps) {
    const { accession, definition, host, id, segment, sequence } =
        activeSequence || {};

    const methods = usePersistentForm<SequenceFormValues>({
        defaultValues: {
            segment: segment || null,
            accession: accession || "",
            definition: definition || "",
            host: host || "",
            sequence: sequence || "",
        },
        formName: `${noun}Sequence${id}`,
    });

    const {
        formState: { errors },
        handleSubmit,
        hasRestored,
        register,
        reset,
    } = methods;

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

                <Accession />

                <InputGroup>
                    <InputLabel htmlFor="host">Host</InputLabel>
                    <InputSimple id="host" {...register("host")} />
                </InputGroup>

                <InputGroup>
                    <InputLabel htmlFor="definition">Definition</InputLabel>
                    <InputSimple
                        id="definition"
                        {...register("definition", {
                            required: "Required Field",
                        })}
                    />
                    <InputError>{errors.definition?.message}</InputError>
                </InputGroup>

                <SequenceField />
                <SaveButton />
            </form>
        </FormProvider>
    );
}
