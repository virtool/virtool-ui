import { Form, Formik } from "formik";
import React from "react";
import { connect } from "react-redux";
import * as Yup from "yup";
import { pushState } from "../../../app/actions";
import { Modal, ModalBody, ModalFooter, ModalHeader, SaveButton } from "../../../base";
import { routerLocationHasState } from "../../../utils/utils";
import { editReference } from "../../actions";
import { ReferenceForm } from "../Form";

const getInitialValues = detail => ({
    name: detail.name,
    description: detail.description,
    organism: detail.organism
});

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required Field")
});

export const EditReference = ({ show, detail, onHide, onSubmit }) => {
    const handleSubmit = ({ name, description, organism }) => {
        onSubmit(detail.id, { name, description, organism });
        onHide();
    };

    return (
        <Modal label="Edit" show={show} onHide={onHide}>
            <ModalHeader>Edit Reference</ModalHeader>
            <Formik
                initialValues={getInitialValues(detail)}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                {({ touched, errors }) => (
                    <Form>
                        <ModalBody>
                            <ReferenceForm errors={errors} touched={touched} mode={"edit"} />
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
    show: routerLocationHasState(state, "editReference"),
    detail: state.references.detail
});

const mapDispatchToProps = dispatch => ({
    onSubmit: (refId, update) => {
        dispatch(editReference(refId, update));
    },

    onHide: () => {
        dispatch(pushState({ editReference: false }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditReference);
