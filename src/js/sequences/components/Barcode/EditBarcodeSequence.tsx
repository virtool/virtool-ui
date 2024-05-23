import { Dialog, DialogContent, DialogOverlay, DialogTitle, SaveButton } from "@base";
import { useEditSequence } from "@otus/queries";
import { OTUSequence } from "@otus/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { ReferenceTarget } from "@references/types";
import { useLocationState } from "@utils/hooks";
import { Field, Form, Formik, FormikErrors, FormikTouched } from "formik";
import { find } from "lodash-es";
import React from "react";
import styled from "styled-components";
import PersistForm from "../../../forms/components/PersistForm";
import { SequenceForm, validationSchema } from "../SequenceForm";
import TargetsField from "./TargetField";

function getInitialValues({ initialTargetName, initialAccession, initialDefinition, initialHost, initialSequence }) {
    return {
        targetName: initialTargetName || null,
        accession: initialAccession || "",
        definition: initialDefinition || "",
        host: initialHost || "",
        sequence: initialSequence || "",
    };
}

export function castValues(targets: ReferenceTarget[], initialTargetName: string) {
    return function (values: formValues) {
        const targetName = find(targets, { name: values.targetName }) ? values.targetName : initialTargetName;
        return { ...values, targetName };
    };
}

const CenteredDialogContent = styled(DialogContent)`
    top: 50%;
`;

type formValues = {
    targetName: string;
    accession: string;
    definition: string;
    host: string;
    sequence: string;
};

type EditBarcodeSequence = {
    activeSequence: OTUSequence;
    /** A list of unreferenced targets */
    targets: ReferenceTarget[];
    isolateId: string;
    otuId: string;
};

/**
 * Displays dialog to edit a barcode sequence
 */
export default function EditBarcodeSequence({ activeSequence, targets, isolateId, otuId }: EditBarcodeSequence) {
    const [locationState, setLocationState] = useLocationState();
    const mutation = useEditSequence(otuId);
    const { accession, definition, host, id, sequence, target } = activeSequence;

    function handleSubmit({ accession, definition, host, sequence, targetName }) {
        mutation.mutate(
            { isolateId, sequenceId: id, accession, definition, host, sequence, target: targetName },
            {
                onSuccess: () => {
                    setLocationState({ editSequence: false });
                },
            },
        );
    }

    const initialValues = getInitialValues({
        initialTargetName: target,
        initialAccession: accession,
        initialDefinition: definition,
        initialHost: host,
        initialSequence: sequence,
    });

    return (
        <Dialog open={locationState?.editSequence} onOpenChange={() => setLocationState({ editSequence: false })}>
            <DialogPortal>
                <DialogOverlay />
                <CenteredDialogContent>
                    <DialogTitle>Edit Sequence</DialogTitle>
                    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                        {({
                            touched,
                            errors,
                            setFieldValue,
                        }: {
                            setFieldValue: (field: string, value: string) => void;
                            errors: FormikErrors<formValues>;
                            touched: FormikTouched<formValues>;
                        }) => (
                            <Form>
                                <PersistForm
                                    formName={`editGenomeSequenceForm${id}`}
                                    castValues={castValues(targets, target)}
                                />
                                <Field
                                    as={TargetsField}
                                    targets={targets}
                                    name="targetName"
                                    onChange={targetName => setFieldValue("targetName", targetName)}
                                />
                                <SequenceForm touched={touched} errors={errors} />
                                <SaveButton />
                            </Form>
                        )}
                    </Formik>
                </CenteredDialogContent>
            </DialogPortal>
        </Dialog>
    );
}
