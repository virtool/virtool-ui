import { getFontSize } from "@app/theme";
import { Box, BoxTitle, InputGroup, InputLabel, InputSimple, SaveButton } from "@base";
import { useSetMessage } from "@message/queries";
import { Message } from "@message/types";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

const InstanceMessageTitle = styled(BoxTitle)`
    font-size: ${getFontSize("lg")};
    margin-bottom: 8px;
`;

const InstanceMessageSubtitle = styled.p`
    color: ${props => props.theme.color.greyDarkest};
    margin: 0 0 15px;
`;

type InstanceMessageProps = {
    message: Message;
};

/**
 * Displays the instance message and provides functionality to update it
 */
export default function InstanceMessage({ message }: InstanceMessageProps) {
    const { register, handleSubmit } = useForm<{ message: string }>({
        defaultValues: { message: message?.message || "" },
    });
    const mutation = useSetMessage();

    return (
        <Box>
            <InstanceMessageTitle>Instance Message</InstanceMessageTitle>
            <InstanceMessageSubtitle>Display a message to all users above the navigation bar.</InstanceMessageSubtitle>
            <form onSubmit={handleSubmit(({ message }) => mutation.mutate({ message }))}>
                <InputGroup>
                    <InputLabel htmlFor="message">Message</InputLabel>
                    <InputSimple id="message" {...register("message")} />
                </InputGroup>
                <SaveButton />
            </form>
        </Box>
    );
}
