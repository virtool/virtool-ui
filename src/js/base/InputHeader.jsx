/*
Behaviours:
- Submit change on blur, enter, or escape.

 */
import React, { useRef } from "react";
import styled from "styled-components";
import { borderRadius, getFontSize, getFontWeight } from "../app/theme";
import { useFormik } from "formik";

const InputHeaderContainer = styled.form`
    border: 2px solid transparent;
    border-radius: ${borderRadius.md};

    box-sizing: border-box;
    margin-bottom: 15px;

    :focus-within {
        background-color: ${props => props.theme.color.greyHover};
        border-color: ${props => props.theme.color.blue};

        > input {
            transform: translateX(15px);
        }
    }
`;

const InputHeaderControl = styled.input`
    background-color: transparent;
    border: none;
    border-radius: 5px;
    font-size: ${getFontSize("xl")};
    font-weight: ${getFontWeight("bold")};
    outline: none;
    padding: 10px 0;
    width: 100%;
`;

export function InputHeader({ id, value = "", onSubmit }) {
    const inputElement = useRef();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: { [id]: value },
        onSubmit: values => {
            onSubmit(values[id]);

            if (inputElement.current) {
                inputElement.current.blur();
            }
        }
    });

    return (
        <InputHeaderContainer onSubmit={formik.handleSubmit}>
            <InputHeaderControl
                autoComplete="off"
                id={id}
                name={id}
                ref={inputElement}
                value={formik.values[id]}
                onBlur={() => {
                    if (!formik.isSubmitting) {
                        formik.submitForm();
                    }
                }}
                onChange={formik.handleChange}
            />
        </InputHeaderContainer>
    );
}
