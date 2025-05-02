import Badge from "../../base/Badge";
import InputError from "../../base/InputError";
import InputGroup from "../../base/InputGroup";
import InputLabel from "../../base/InputLabel";
import TextArea from "../../base/TextArea";
import React from "react";
import { useFormContext } from "react-hook-form";
import styled from "styled-components";

const SequenceFieldTextArea = styled(TextArea)`
    font-family: ${(props) => props.theme.fontFamily.monospace};
    text-transform: uppercase;
`;

/**
 * Displays the sequence field of a form.
 */
export default function SequenceField() {
    const {
        formState: { errors },
        register,
        watch,
    } = useFormContext<{ sequence: string }>();

    return (
        <InputGroup>
            <InputLabel htmlFor="sequence">
                Sequence <Badge>{watch("sequence")?.length}</Badge>
            </InputLabel>
            <SequenceFieldTextArea
                id="sequence"
                {...register("sequence", {
                    required: "Required Field",
                    pattern: {
                        value: /^[ATCGNRYKM]*$/,
                        message:
                            "Sequence should only contain the characters: ATCGNRYKM",
                    },
                })}
            />
            <InputError>{errors.sequence?.message}</InputError>
        </InputGroup>
    );
}
