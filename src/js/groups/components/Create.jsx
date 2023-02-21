import { Field, Form, Formik } from "formik";
import { get } from "lodash-es";
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
    SaveButton
} from "../../base";
import { createGroup, getGroup } from "../actions";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Provide a name for the group")
});

export const Create = ({ error, show, onCreate, onHide }) => {
    const handleSubmit = values => {
        onCreate(values.name);
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
    onChangeActiveGroup: groupId => {
        dispatch(getGroup(groupId));
    },
    onCreate: name => {
        dispatch(createGroup(name));
    },
    onHide: () => {
        dispatch(pushState({ createGroup: false }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Create);
