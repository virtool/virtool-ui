import InputGroup from '@base/InputGroup';
import InputLabel from '@base/InputLabel';
import InputSimple from '@base/InputSimple';
import { SaveButton } from '@base';
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import { useSetMessage } from "@message/queries";
import { Message } from "@message/types";
import React from "react";
import { useForm } from "react-hook-form";

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
        <BoxGroup>
            <BoxGroupHeader>
                <h2>Instance Message</h2>
                <p>Display a message to all users above the navigation bar.</p>
            </BoxGroupHeader>
            <BoxGroupSection>
                <form
                    onSubmit={handleSubmit(({ message }) =>
                        mutation.mutate({ message }),
                    )}
                >
                    <InputGroup>
                        <InputLabel htmlFor="message">Message</InputLabel>
                        <InputSimple id="message" {...register("message")} />
                    </InputGroup>
                    <SaveButton />
                </form>
            </BoxGroupSection>
        </BoxGroup>
    );
}
