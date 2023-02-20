import React from "react";
import styled from "styled-components/macro";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { ModalBody } from "./ModalBody";
import { ModalFooter } from "./ModalFooter";
import { ModalHeader } from "./ModalHeader";

const RemoveModalBody = styled(ModalBody)`
    padding: 15px 15px 25px;
`;

interface RemoveModalProps {
    message?: React.ReactNode;
    name: string;
    noun: string;
    show: boolean;
    onConfirm: () => void;
    onHide: () => void;
}

/**
 * A modal that requests confirmation from the user for deleting a document or other sensitive information.
 *
 * @func
 * @param message {string} a message to override the default one displayed in the modal body
 * @param name {string} the display name for the item to be removed (eg. Baminivirus)
 * @param noun {string} the type of document being removed (eg. otu)
 * @param show {boolean} toggle visibility of the modal
 * @param onConfirm {function} a function to call on confirmation
 * @param onHide {function} a function that hides the modal
 */
export const RemoveModal = ({ message, name, noun, show, onConfirm, onHide }: RemoveModalProps) => (
    <Modal color="red" label="Remove" show={show} onHide={onHide}>
        <ModalHeader>{`Remove ${noun}`}</ModalHeader>
        <RemoveModalBody>
            {message || (
                <span>
                    Are you sure you want to remove <strong>{name}</strong>?
                </span>
            )}
        </RemoveModalBody>
        <ModalFooter>
            <Button color="red" icon="check" onClick={onConfirm}>
                Confirm
            </Button>
        </ModalFooter>
    </Modal>
);
