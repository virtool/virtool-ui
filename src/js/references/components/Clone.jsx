import { Field, Form, Formik } from "formik";
import { find } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import * as Yup from "yup";
import { pushState } from "../../app/actions";
import {
    Attribution,
    Badge,
    Box,
    Input,
    InputError,
    InputGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    SaveButton,
} from "../../base";
import { routerLocationHasState } from "../../utils/utils";
import { cloneReference } from "../actions";

const getInitialValues = originalRef => ({
    name: originalRef ? `Clone of ${originalRef.name}` : "",
});

const ReferenceBox = styled(Box)`
    display: flex;
    align-items: center;

    ${Badge} {
        margin-left: 5px;
    }

    span: last-child {
        margin-left: auto;
    }
`;

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required Field"),
});

export const CloneReference = ({ refId, refDocuments, show, onHide, onSubmit }) => {
    const reference = find(refDocuments, { id: refId });

    const handleSubmit = ({ name }) => {
        onSubmit(name, `Cloned from ${reference.name}`, reference.id);
    };

    return (
        <Modal label="Clone Reference" onHide={onHide} show={show}>
            <ModalHeader>Clone Reference</ModalHeader>
            <Formik
                onSubmit={handleSubmit}
                initialValues={getInitialValues(reference)}
                validationSchema={validationSchema}
            >
                {({ touched, errors }) => (
                    <Form>
                        <ModalBody>
                            <label htmlFor="selectedReference"> Selected reference </label>
                            {reference && (
                                <ReferenceBox id="selectedReference">
                                    <strong>{reference.name}</strong> <Badge>{reference.otu_count} OTUs</Badge>
                                    <Attribution time={reference.created_at} user={reference.user.handle} />
                                </ReferenceBox>
                            )}
                            <label htmlFor="name"> Name </label>
                            <InputGroup>
                                <Field name="name" id="name" as={Input} />
                                <InputError>{touched.name && errors.name}</InputError>
                            </InputGroup>
                        </ModalBody>
                        <ModalFooter>
                            <SaveButton disabled={!refDocuments.length} altText="Clone" />
                        </ModalFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export const mapStateToProps = state => ({
    refId: routerLocationHasState(state, "id") ? state.router.location.state.id : "",
    refDocuments: state.references.documents,
    show: routerLocationHasState(state, "cloneReference"),
});

export const mapDispatchToProps = dispatch => ({
    onSubmit: (name, description, dataType, organism, refId) => {
        dispatch(cloneReference(name, description, dataType, organism, refId));
    },
    onHide: () => {
        dispatch(pushState({ cloneReference: false }));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(CloneReference);
