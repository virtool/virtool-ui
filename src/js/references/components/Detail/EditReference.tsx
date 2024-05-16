import { DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogFooter, DialogOverlay, DialogTitle, SaveButton } from "../../../base";
import { editReference } from "../../actions";
import { Reference, ReferenceDataType } from "../../types";
import { ReferenceForm, ReferenceFormMode } from "../ReferenceForm";

export type FormValues = {
    name: string;
    description: string;
    dataType: ReferenceDataType;
    organism: string;
};

type EditReferenceProps = {
    /** Indicates whether the dialog for editing a reference is visible */
    show: boolean;
    /** The reference details */
    detail: Reference;
    /** A callback to hide the dialog */
    onHide: () => void;
    /** A callback function to be called when the form is submitted */
    onSubmit: (refId: string, update: { organism: string; name: string; description: string }) => void;
};

/**
 * A dialog for editing a reference
 */
export function EditReference({ detail, onSubmit }: EditReferenceProps) {
    const location = useLocation<{ editReference: boolean }>();
    const history = useHistory();

    function handleEdit({ name, description, organism }) {
        onSubmit(detail.id, { name, description, organism });
        history.replace({ state: { editReference: false } });
    }

    const {
        formState: { errors },
        handleSubmit,
        register,
    } = useForm<FormValues>({
        defaultValues: { name: detail.name, description: detail.description, organism: detail.organism },
    });

    return (
        <Dialog
            open={location.state?.editReference}
            onOpenChange={() => history.replace({ state: { editReference: false } })}
        >
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Edit Reference</DialogTitle>
                    <form onSubmit={handleSubmit(values => handleEdit({ ...values }))}>
                        <ReferenceForm errors={errors} mode={ReferenceFormMode.edit} register={register} />
                        <DialogFooter>
                            <SaveButton />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

const mapStateToProps = state => ({
    detail: state.references.detail,
});

const mapDispatchToProps = dispatch => ({
    onSubmit: (refId, update) => {
        dispatch(editReference(refId, update));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditReference);
