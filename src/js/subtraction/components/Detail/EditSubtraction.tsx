import React from "react";
import { useForm } from "react-hook-form";
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
import { useUpdateSubtraction } from "../../querys";
import { Subtraction } from "../../types";

type EditSubtractionProps = {
    /** The subtraction data */
    subtraction: Subtraction;
    /** Indicates whether the modal for editing a subtraction is visible */
    show: boolean;
    /** A callback function to hide the modal */
    onHide: () => void;
};

/**
 * Displays a modal for editing a subtraction
 */
export default function EditSubtraction({ subtraction, show, onHide }: EditSubtractionProps) {
    const mutation = useUpdateSubtraction(subtraction.id);

    const {
        formState: { errors },
        register,
        handleSubmit,
    } = useForm({ defaultValues: { name: subtraction.name, nickname: subtraction.nickname } });

    function onSubmit({ name, nickname }) {
        mutation.mutate({ name, nickname });
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
