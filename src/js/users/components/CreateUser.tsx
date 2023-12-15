import React from "react";
import { useMutation } from "react-query";
import { Modal, ModalHeader } from "../../base";
import { HistoryType } from "../../utils/hooks";
import { create } from "../api";
import { CreateUserForm } from "./CreateUserForm";

type NewUser = {
    /** The user's handle or username */
    handle: string;
    /** The user's password */
    password: string;
    /** Whether the user will be forced to reset their password on next login */
    forceReset: boolean;
};

type CreateUserProps = {
    /** Indicates whether the modal for creating a user is visible */
    show: boolean;
    /** The history object */
    history: HistoryType;
};

/**
 * A dialog for creating a new user
 */
export default function CreateUser({ show, history }: CreateUserProps) {
    const mutation = useMutation(create, {
        onSuccess: () => {
            history.push({ state: { createUser: false } });
        },
    });

    function handleSubmit({ handle, password, forceReset }: NewUser) {
        mutation.mutate({ handle, password, forceReset });
    }

    function onHide() {
        mutation.reset();
        history.push({ state: { createUser: false } });
    }

    return (
        <Modal label="Create User" show={show} onHide={onHide}>
            <ModalHeader>Create User</ModalHeader>
            <CreateUserForm
                onSubmit={handleSubmit}
                error={mutation.isError && mutation.error["response"]?.body.message}
            />
        </Modal>
    );
}
