import React from "react";
import { pushState } from "../../app/actions";
import { getRouterLocationStateValue } from "../../app/selectors";
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
import { get } from "lodash-es";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Provide a name for the group")
});

export const Create = ({ onCreate, show, onHide, error }) => {
    const handleSubmit = values => {
        onCreate(values.name);
    };
    return (
        <Modal label="Create Group" onHide={onHide} show={show} size="lg">
            <ModalHeader>Create Group</ModalHeader>
            <Formik onSubmit={handleSubmit} initialValues={{ name: "" }} validationSchema={validationSchema}>
                {({ errors, touched }) => (
                    <Form>
                        <ModalBody>
                            <InputGroup>
                                <InputLabel>Name</InputLabel>
                                <Field name="name" id="name" as={Input} />
                                <InputError>{touched.name && (error || errors.name)}</InputError>
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

const mapStateToProps = state => ({
    show: Boolean(getRouterLocationStateValue(state, "createGroup")),
    error: get(state, "errors.CREATE_GROUP_ERROR.message", "")
});

const mapDispatchToProps = dispatch => ({
    onCreate: groupId => {
        dispatch(createGroup(groupId));
    },
    onHide: () => {
        dispatch(pushState({ createGroup: false }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Create);
