import { Field, Form, Formik } from "formik";
import React from "react";
import styled from "styled-components";
import { getFontSize } from "../../app/theme";
import { Box, BoxTitle, Input, InputGroup, InputLabel, LoadingPlaceholder, SaveButton } from "../../base";
import { useFetchMessage, useSetMessage } from "../../message/querys";

const InstanceMessageTitle = styled(BoxTitle)`
    font-size: ${getFontSize("lg")};
    margin-bottom: 8px;
`;

const InstanceMessageSubtitle = styled.p`
    color: ${props => props.theme.color.greyDarkest};
    margin: 0 0 15px;
`;

/**
 * Displays the instance message and provides functionality to update it
 */
export default function InstanceMessage() {
    const { data, isLoading } = useFetchMessage();
    const mutation = useSetMessage();

    if (isLoading) {
        return (
            <Box>
                <LoadingPlaceholder />
            </Box>
        );
    }

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
