import { DialogPortal } from "@radix-ui/react-dialog";
import { useLocationState } from "@utils/hooks";
import { Field, Form, Formik, FormikErrors, FormikTouched } from "formik";
import { find } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Dialog, DialogContent, DialogOverlay, DialogTitle, SaveButton } from "../../../base";
import PersistForm from "../../../forms/components/PersistForm";
import { editSequence } from "../../../otus/actions";
import { getActiveIsolateId, getOTUDetailId } from "../../../otus/selectors";
import { ReferenceTarget } from "../../../references/types";
import { getActiveSequence, getUnreferencedTargets } from "../../selectors";
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
    id: string;
    initialAccession: string;
    initialDefinition: string;
    initialHost: string;
    initialSequence: string;
    initialTargetName: string;
    /** A list of unreferenced targets */
    targets: ReferenceTarget[];
    isolateId: string;
    otuId: string;
    /** A callback function to update the sequence */
    onSave: (
        otuId: string,
        isolateId: string,
        id: string,
        accession: string,
        definition: string,
        host: string,
        sequence: string,
        targetName: string,
    ) => void;
};

/**
 * Displays dialog to edit a barcode sequence
 */
export function EditBarcodeSequence({
    id,
    initialAccession,
    initialDefinition,
    initialHost,
    initialSequence,
    initialTargetName,
    targets,
    isolateId,
    otuId,
    onSave,
}: EditBarcodeSequence) {
    const [locationState, setLocationState] = useLocationState();

    function handleSubmit({ accession, definition, host, sequence, targetName }) {
        onSave(otuId, isolateId, id, accession, definition, host, sequence, targetName);
    }

    const initialValues = getInitialValues({
        initialTargetName,
        initialAccession,
        initialDefinition,
        initialHost,
        initialSequence,
    });

    return (
        <Dialog open={locationState?.addSequence} onOpenChange={() => setLocationState({ addSequence: false })}>
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
                                    castValues={castValues(targets, initialTargetName)}
                                />
                                <Field
                                    as={TargetsField}
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

export function mapStateToProps(state) {
    const { accession, definition, host, id, sequence, target } = getActiveSequence(state);

    return {
        id,
        initialAccession: accession,
        initialDefinition: definition,
        initialHost: host,
        initialSequence: sequence,
        initialTargetName: target,
        targets: getUnreferencedTargets(state),
        isolateId: getActiveIsolateId(state),
        otuId: getOTUDetailId(state),
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        onSave: (otuId, isolateId, sequenceId, accession, definition, host, sequence, target) => {
            dispatch(editSequence({ otuId, isolateId, sequenceId, accession, definition, host, sequence, target }));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBarcodeSequence);
