import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getInstanceMessage, setInstanceMessage } from "../../message/actions";
import { Box, BoxTitle, Input, InputGroup, InputLabel, LoadingPlaceholder, SaveButton } from "../../base";
import { Field, Form, Formik } from "formik";
import styled from "styled-components";
import { getFontSize } from "../../app/theme";

const InstanceMessageTitle = styled(BoxTitle)`
    font-size: ${getFontSize("lg")};
    margin-bottom: 8px;
`;

const InstanceMessageSubtitle = styled.p`
    color: ${props => props.theme.color.greyDarkest};
    margin: 0 0 15px;
`;

function InstanceMessage({ loaded, message, onLoad, onSet }) {
    useEffect(() => onLoad(), [loaded, message]);

    if (!loaded) {
        return (
            <Box>
                <LoadingPlaceholder />
            </Box>
        );
    }

    const initialValues = { message: message || "" };

    return (
        <Box>
            <InstanceMessageTitle>Instance Message</InstanceMessageTitle>
            <InstanceMessageSubtitle>Display a message to all users above the navigation bar.</InstanceMessageSubtitle>

            <Formik initialValues={initialValues} onSubmit={values => onSet(values.message)}>
                {() => (
                    <Form>
                        <InputGroup>
                            <InputLabel>Message</InputLabel>
                            <Field type="text" name="message" as={Input} />
                        </InputGroup>
                        <SaveButton />
                    </Form>
                )}
            </Formik>
        </Box>
    );
}

function mapStateToProps(state) {
    return {
        color: state.instanceMessage.color,
        loaded: state.instanceMessage.loaded,
        message: state.instanceMessage.message
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onSet: message => dispatch(setInstanceMessage(message)),
        onLoad: () => dispatch(getInstanceMessage())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InstanceMessage);
