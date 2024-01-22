import React from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { pushState } from "../../../app/actions";
import { Modal, ModalBody, ModalFooter, ModalHeader, SaveButton } from "../../../base";
import { routerLocationHasState } from "../../../utils/utils";
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
export function EditReference({ show, detail, onHide, onSubmit }: EditReferenceProps) {
    function handleEdit({ name, description, organism }) {
        onSubmit(detail.id, { name, description, organism });
        onHide();
    }

    const {
        formState: { errors },
        handleSubmit,
        register,
    } = useForm<FormValues>({
        defaultValues: { name: detail.name, description: detail.description, organism: detail.organism },
    });

    return (
        <Modal label="Edit" show={show} onHide={onHide}>
            <ModalHeader>Edit Reference</ModalHeader>
            <form onSubmit={handleSubmit(values => handleEdit({ ...values }))}>
                <ModalBody>
                    <ReferenceForm errors={errors} mode={ReferenceFormMode.edit} register={register} />
                </ModalBody>
                <ModalFooter>
                    <SaveButton />
                </ModalFooter>
            </form>
        </Modal>
    );
}

const mapStateToProps = state => ({
    show: routerLocationHasState(state, "editReference"),
    detail: state.references.detail,
});

const mapDispatchToProps = dispatch => ({
    onSubmit: (refId, update) => {
        dispatch(editReference(refId, update));
    },

    onHide: () => {
        dispatch(pushState({ editReference: false }));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditReference);
