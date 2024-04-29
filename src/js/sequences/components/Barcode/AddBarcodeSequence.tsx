import { useAddSequence } from "@otus/queries";
import { DialogPortal } from "@radix-ui/react-dialog";
import { Field, Form, Formik, FormikErrors, FormikTouched } from "formik";
import { find } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Dialog, DialogContent, DialogOverlay, DialogTitle, SaveButton } from "../../../base";
import PersistForm from "../../../forms/components/PersistForm";
import { getActiveIsolateId, getOTUDetailId } from "../../../otus/selectors";
import { ReferenceTarget } from "../../../references/types";
import { getDefaultTargetName, getUnreferencedTargets } from "../../selectors";
import { SequenceForm, validationSchema } from "../SequenceForm";
import TargetsField from "./TargetField";

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
    /** The default target */
    defaultTarget: string;
    isolateId: string;
    otuId: string;
    /** A list of unreferenced targets */
    targets: ReferenceTarget[];
};

/**
 * Displays dialog to add a barcode sequence
 */
export function AddBarcodeSequence({ defaultTarget, isolateId, otuId, targets }: AddBarcodeSequenceProps) {
    const history = useHistory();
    const location = useLocation<{ addSequence: boolean }>();
    const mutation = useAddSequence();

    function handleSubmit({ accession, definition, host, sequence, targetName }) {
        mutation.mutate({
            otuId,
            isolateId,
            accession,
            definition,
            host,
            sequence: sequence.toUpperCase(),
            target: targetName,
        });
    }

    const initialValues = getInitialValues(defaultTarget);

    return (
        <Dialog open={location.state?.addSequence} onOpenChange={() => history.push({ state: { addSequence: false } })}>
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
                                    formName="addGenomeSequenceForm"
                                    castValues={castValues(targets, defaultTarget)}
                                />
                                <Field
                                    as={TargetsField}
                                    name="targetName"
                                    onChange={(targetName: string) => setFieldValue("targetName", targetName)}
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
    return {
        defaultTarget: getDefaultTargetName(state),
        isolateId: getActiveIsolateId(state),
        otuId: getOTUDetailId(state),
        targets: getUnreferencedTargets(state),
    };
}

export default connect(mapStateToProps, null)(AddBarcodeSequence);
