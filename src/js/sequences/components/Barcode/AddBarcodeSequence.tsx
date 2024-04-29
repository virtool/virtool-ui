import { DialogPortal } from "@radix-ui/react-dialog";
import { Field, Form, Formik, FormikErrors, FormikTouched } from "formik";
import { find } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { pushState } from "../../../app/actions";
import { Dialog, DialogContent, DialogOverlay, DialogTitle, SaveButton } from "../../../base";
import PersistForm from "../../../forms/components/PersistForm";
import { addSequence } from "../../../otus/actions";
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
    /** Indicates whether the dialog for adding a sequence is visible */
    show: boolean;
    /** A callback function to hide the dialog */
    onHide: () => void;
    /** A callback function to add the sequence */
    onSave: (
        otuId: string,
        isolateId: string,
        accession: string,
        definition: string,
        host: string,
        sequence: string,
        targetName: string,
    ) => void;
    /** A list of unreferenced targets */
    targets: ReferenceTarget[];
};

/**
 * Displays dialog to add a barcode sequence
 */
export function AddBarcodeSequence({ defaultTarget, isolateId, otuId, onSave, targets }: AddBarcodeSequenceProps) {
    const history = useHistory();
    const location = useLocation<{ addSequence: boolean }>();

    function handleSubmit({ accession, definition, host, sequence, targetName }) {
        console.log(otuId, isolateId, accession, definition, host, sequence, targetName);
        onSave(otuId, isolateId, accession, definition, host, sequence.toUpperCase(), targetName);
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

export function mapDispatchToProps(dispatch) {
    return {
        onHide: () => {
            dispatch(pushState({ addSequence: false }));
        },

        onSave: (otuId, isolateId, accession, definition, host, sequence, target) => {
            dispatch(addSequence({ otuId, isolateId, accession, definition, host, sequence, target }));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddBarcodeSequence);
