import { SaveButton } from "@base";
import { RestoredAlert } from "@forms/components/RestoredAlert";
import { usePersistentForm } from "@forms/hooks";
import { OTUSequence } from "@otus/types";
import { ReferenceTarget } from "@references/types";
import TargetField from "@sequences/components/Barcode/TargetField";
import React from "react";
import { FormProvider } from "react-hook-form";
import { SequenceForm } from "../SequenceForm";

type FormValues = {
    target: string;
    accession: string;
    definition: string;
    host: string;
    sequence: string;
};

type BarcodeSequenceProps = {
    activeSequence?: OTUSequence;
    /** Whether the form is of type edit or add */
    noun: string;
    /** A callback function to add/edit a barcode sequence  */
    onSubmit: (formValues: FormValues) => void;
    otuId: string;
    /** A list of unreferenced targets */
    targets: ReferenceTarget[];
};

/**
 * A form for creating or editing a barcode sequence
 */
export default function BarcodeSequenceForm({ activeSequence, noun, onSubmit, targets }: BarcodeSequenceProps) {
    const { accession, definition, host, id, sequence, target } = activeSequence || {};
    const methods = usePersistentForm<FormValues>({
        formName: `${noun}BarcodeSequence${id}`,
        defaultValues: {
            target: target || targets[0]?.name || null,
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
                <RestoredAlert hasRestored={hasRestored} name="sequence" resetForm={reset} />
                <TargetField targets={targets} />
                <SequenceForm />
                <SaveButton />
            </form>
        </FormProvider>
    );
}
