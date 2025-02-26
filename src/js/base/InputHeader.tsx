import { borderRadius, getFontSize, getFontWeight } from "@app/theme";
import React, { MutableRefObject, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { objectHasProperty } from "@utils/common";

const InputHeaderContainer = styled.form`
    border: 2px solid transparent;
    border-radius: ${borderRadius.md};

    box-sizing: border-box;
    margin-bottom: 15px;

    &:focus-within {
        background-color: ${(props) => props.theme.color.greyHover};
        border-color: ${(props) => props.theme.color.blue};

        > input {
            transform: translateX(15px);
        }
    }
`;

type InputHeaderControlProps = {
    ref: MutableRefObject<HTMLInputElement>;
};

const InputHeaderControl = styled.input<InputHeaderControlProps>`
    background-color: transparent;
    border: none;
    border-radius: 5px;
    font-size: ${getFontSize("xl")};
    font-weight: ${getFontWeight("bold")};
    outline: none;
    padding: 10px 0;
    width: 100%;
`;

type InputHeaderProps = {
    id: string;
    value?: string;
    onSubmit: (value: string) => void;
};

/**
 * A styled input header field that handles form submission
 */
export function InputHeader({ id, value = "", onSubmit }: InputHeaderProps) {
    const inputElement = useRef<HTMLInputElement>();

    const {
        formState: { isSubmitting },
        handleSubmit,
        setValue,
        watch,
    } = useForm({
        defaultValues: { [id]: value },
    });

    function onFormSubmit(data) {
        onSubmit(data[id]);

        if (
            inputElement.current &&
            objectHasProperty(inputElement.current, "blur")
        ) {
            inputElement.current.blur();
        }
    }

    useEffect(() => {
        setValue(id, value);
    }, [value, id, setValue]);

    return (
        <InputHeaderContainer onSubmit={handleSubmit(onFormSubmit)}>
            <InputHeaderControl
                aria-label={id}
                autoComplete="off"
                id={id}
                name={id}
                ref={inputElement}
                value={watch(id)}
                onBlur={() => {
                    if (!isSubmitting) {
                        handleSubmit(onFormSubmit)();
                    }
                }}
                onChange={(e) => {
                    setValue(id, e.target.value);
                }}
            />
        </InputHeaderContainer>
    );
}
