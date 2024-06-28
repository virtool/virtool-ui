import { Dialog, DialogContent, DialogOverlay, DialogTitle, SaveButton } from "@base";
import { useAddSequence } from "@otus/queries";
import { DialogPortal } from "@radix-ui/react-dialog";
import { ReferenceTarget } from "@references/types";
import TargetField from "@sequences/components/Barcode/TargetField";
import { useLocationState } from "@utils/hooks";
import { Field, Form, Formik, FormikErrors, FormikTouched } from "formik";
import { find } from "lodash-es";
import React from "react";
import styled from "styled-components";
import PersistForm from "../../../forms/components/PersistForm";
import { SequenceForm, validationSchema } from "../SequenceForm";

function getInitialValues(defaultTarget: string) {
    return {
        targetName: defaultTarget,
        accession: "",
        definition: "",
        host: "",
        sequence: "",
    };
}

export function castValues(targets: ReferenceTarget[], defaultTarget: string) {
    return function (values: formValues) {
        const targetName = find(targets, { name: values.targetName }) ? values.targetName : defaultTarget;
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

type AddBarcodeSequenceProps = {
    isolateId: string;
    otuId: string;
    /** A list of unreferenced targets */
    targets: ReferenceTarget[];
};

/**
 * Displays dialog to add a barcode sequence
 */
export default function AddBarcodeSequence({ isolateId, otuId, targets }: AddBarcodeSequenceProps) {
    const [locationState, setLocationState] = useLocationState();
    const mutation = useAddSequence(otuId);

    function handleSubmit({ accession, definition, host, sequence, targetName }) {
        mutation.mutate(
            {
                isolateId,
                accession,
                definition,
                host,
                sequence: sequence.toUpperCase(),
                target: targetName,
            },
            {
                onSuccess: () => {
                    setLocationState({ addSequence: false });
                },
            },
        );
    }

    const defaultTarget = targets[0]?.name;
    const initialValues = getInitialValues(defaultTarget);

    return (
        <Dialog open={locationState?.addSequence} onOpenChange={() => setLocationState({ addSequence: false })}>
            <DialogPortal>
                <DialogOverlay />
                <CenteredDialogContent>
                    <DialogTitle>Add Sequence</DialogTitle>
                    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                        {({
                            errors,
                            touched,
                            setFieldValue,
                        }: {
                            setFieldValue: (field: string, value: string) => void;
                            errors: FormikErrors<formValues>;
                            touched: FormikTouched<formValues>;
                        }) => (
                            <Form>
                                <PersistForm
                                    castValues={castValues(targets, defaultTarget)}
                                    formName="addGenomeSequenceForm"
                                    resourceName="sequence"
                                />
                                <Field
                                    as={TargetField}
                                    name="targetName"
                                    onChange={(targetName: string) => setFieldValue("targetName", targetName)}
                                    targets={targets}
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
