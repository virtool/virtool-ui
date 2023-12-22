import React, { useState } from "react";
import { connect } from "react-redux";
import {
    Input,
    InputError,
    InputGroup,
    InputLabel,
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
    const [values, setValues] = useState({
        error: "",
        name: subtraction.name,
        nickname: subtraction.nickname,
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setValues(prevValues => ({ ...prevValues, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!values.name) {
            return setValues(prevValues => ({ ...prevValues, error: "A name must be provided" }));
        }

        onUpdate(subtraction.id, values.name, values.nickname);
        onHide();
    }

    return (
        <Modal label="Edit Subtraction" show={show} onHide={onHide}>
            <ModalHeader>Edit Subtraction</ModalHeader>
            <form onSubmit={handleSubmit}>
                <ModalBody>
                    <InputGroup>
                        <InputLabel>Name</InputLabel>
                        <Input name="name" value={values.name} onChange={handleChange} />
                        <InputError>{values.error}</InputError>
                    </InputGroup>
                    <InputGroup>
                        <InputLabel>Nickname</InputLabel>
                        <Input name="nickname" value={values.nickname} onChange={handleChange} />
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
