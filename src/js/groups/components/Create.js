import React from "react";
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    InputGroup,
    InputLabel,
    InputError,
    Input,
    SaveButton
} from "../../base";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { createGroup } from "../actions";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Provide a name for the group")
});

export const Create = ({ onCreate, showGroupCreation, setShowGroupCreation }) => {
    const handleSubmit = values => {
        onCreate(values.name);
        setShowGroupCreation(false);
    };

    return (
        <Modal label="Create Group" onHide={() => setShowGroupCreation(false)} show={showGroupCreation} size="lg">
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
};

const mapDispatchToProps = dispatch => ({
    onCreate: groupId => {
        dispatch(createGroup(groupId));
    }
});

export default connect(null, mapDispatchToProps)(Create);
