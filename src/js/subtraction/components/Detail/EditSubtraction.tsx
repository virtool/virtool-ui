import React from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import {
    InputError,
    InputGroup,
    InputLabel,
    InputSimple,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    SaveButton,
} from "../../../base";
import { editSubtraction } from "../../actions";
import { Subtraction } from "../../types";

type EditSubtractionProps = {
    /** The subtraction data */
    subtraction: Subtraction;
    /** A callback function to update the subtraction data */
    onUpdate: (subtractionId: string, name: string, nickname: string) => void;
    /** Indicates whether the modal for editing a subtraction is visible */
    show: boolean;
    /** A callback function to hide the modal */
    onHide: () => void;
};

/**
 * A modal for editing the subtraction
 */
export function EditSubtraction({ subtraction, onUpdate, show, onHide }: EditSubtractionProps) {
    const {
        formState: { errors },
        register,
        handleSubmit,
    } = useForm({ defaultValues: { name: subtraction.name, nickname: subtraction.nickname } });

    function onSubmit({ name, nickname }) {
        onUpdate(subtraction.id, name, nickname);
        onHide();
    }

    return (
        <Modal label="Edit Subtraction" show={show} onHide={onHide}>
            <ModalHeader>Edit Subtraction</ModalHeader>
            <form onSubmit={handleSubmit(values => onSubmit({ ...values }))}>
                <ModalBody>
                    <InputGroup>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <InputSimple id="name" {...register("name", { required: "A name must be provided" })} />
                        <InputError>{errors.name?.message}</InputError>
                    </InputGroup>
                    <InputGroup>
                        <InputLabel htmlFor="nickname">Nickname</InputLabel>
                        <InputSimple id="nickname" {...register("nickname")} />
                    </InputGroup>
                </ModalBody>

                <ModalFooter>
                    <SaveButton />
                </ModalFooter>
            </form>
        </Modal>
    );
}

export function mapDispatchToProps(dispatch) {
    return {
        onUpdate: (id, name, nickname) => {
            dispatch(editSubtraction(id, name, nickname));
        },
    };
}

export default connect(null, mapDispatchToProps)(EditSubtraction);
