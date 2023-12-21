import { Field, Form, Formik } from "formik";
import React from "react";
import styled from "styled-components";
import { getFontSize } from "../../app/theme";
import { Box, BoxTitle, Input, InputGroup, InputLabel, SaveButton } from "../../base";
import { useSetMessage } from "../../message/querys";
import { Message } from "../../message/types";

const InstanceMessageTitle = styled(BoxTitle)`
    font-size: ${getFontSize("lg")};
    margin-bottom: 8px;
`;

const InstanceMessageSubtitle = styled.p`
    color: ${props => props.theme.color.greyDarkest};
    margin: 0 0 15px;
`;

type InstanceMessageProps = {
    /** The instance message data */
    data: Message;
};

/**
 * Displays the instance message and provides functionality to update it
 */
export default function InstanceMessage({ data }: InstanceMessageProps) {
    const mutation = useSetMessage();

    const initialValues = { message: data?.message || "" };

    return (
        <Box>
            <InstanceMessageTitle>Instance Message</InstanceMessageTitle>
            <InstanceMessageSubtitle>Display a message to all users above the navigation bar.</InstanceMessageSubtitle>

            <Formik initialValues={initialValues} onSubmit={values => mutation.mutate({ message: values.message })}>
                {() => (
                    <Form>
                        <InputGroup>
                            <InputLabel htmlFor="instanceMessage">Message</InputLabel>
                            <Field id="instanceMessage" type="text" name="message" as={Input} />
                        </InputGroup>
                        <SaveButton />
                    </Form>
                )}
            </Formik>
        </Box>
    );
}
