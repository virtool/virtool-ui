import { Field, Form, Formik } from "formik";
import React from "react";
import { connect } from "react-redux";
import * as Yup from "yup";
import { pushState } from "../../app/actions";
import { getRouterLocationStateValue } from "../../app/selectors";
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
} from "../../base";
import { useCreateGroup } from "../querys";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Provide a name for the group"),
});

type CreateProps = {
    show: boolean;
    onHide: () => void;
};

/**
 * Creation of a new Group
 *
 * @param show - Gets the status of createGroup
 * @param onHide - Hides the create group form on success
 * @returns A newly created Group
 */
export function Create({ show, onHide }: CreateProps) {
    const createGroupMutation = useCreateGroup();

    const handleSubmit = (values: { name: string }) => {
        createGroupMutation.mutate(
            { name: values.name },
            {
                onSuccess: () => {
                    onHide();
                },
            },
        );
    };

    return (
        <Modal label="Create" onHide={onHide} show={show} size="sm">
            <ModalHeader>Create Group</ModalHeader>
            <Formik onSubmit={handleSubmit} initialValues={{ name: "" }} validationSchema={validationSchema}>
                {({ errors, touched }) => (
                    <Form>
                        <ModalBody>
                            <InputGroup>
                                <InputLabel>Name</InputLabel>
                                <Field name="name" id="name" as={Input} />
                                <InputError>{touched.name && errors.name}</InputError>
                            </InputGroup>
                        </ModalBody>
                        <ModalFooter>
                            <SaveButton />
                        </ModalFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}

function mapStateToProps(state) {
    return {
        show: Boolean(getRouterLocationStateValue(state, "createGroup")),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onHide: () => {
            dispatch(pushState({ createGroup: false }));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Create);
