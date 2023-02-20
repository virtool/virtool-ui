import React, { useImperativeHandle } from "react";
import styled from "styled-components/macro";

function getInputFocusColor({ error }: { error?: string }) {
    return error ? "rgba(229, 62, 62, 0.5)" : "rgba(43, 108, 176, 0.5)";
}

type InputHandle = {
    blur: () => void;
    focus: () => void;
};

interface InputProps {
    "aria-label?": string;
    autoFocus?: boolean;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    error?: string;
    id?: string;
    max?: number;
    min?: number;
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
    step?: number;
    type?: string;
    value: string | number;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const UnstyledInput = React.forwardRef<InputHandle, InputProps>((props: InputProps, ref) => {
    const {
        autoFocus = false,
        children,
        className = "",
        disabled = false,
        id,
        max,
        min,
        name,
        placeholder,
        readOnly = false,
        step,
        type,
        value,
        onBlur,
        onChange,
        onFocus
    } = props;

    const ariaLabel = props["aria-label"];

    const inputRef = React.useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        blur: () => {
            inputRef.current.blur();
        },
        focus: () => {
            inputRef.current.focus();
        }
    }));

    return (
        <input
            aria-label={ariaLabel}
            ref={inputRef}
            autoFocus={autoFocus}
            className={className}
            disabled={disabled}
            id={id}
            max={max}
            min={min}
            name={name}
            placeholder={placeholder}
            readOnly={readOnly}
            step={step}
            type={type}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
        >
            {children}
        </input>
    );
});

UnstyledInput.displayName = "UnstyledInput";

export const Input = styled(UnstyledInput)<InputProps>`
    background-color: ${props => props.theme.color.white};
    border: 1px solid ${props => (props.error ? props.theme.color.red : props.theme.color.greyLight)};
    border-radius: ${props => props.theme.borderRadius.sm};
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    display: block;
    font-size: ${props => props.theme.fontSize.md};
    height: auto;
    outline: none;
    padding: 8px 10px;
    position: relative;
    transition: border-color ease-in-out 150ms, box-shadow ease-in-out 150ms;
    width: 100%;

    :focus {
        border-color: ${props => (props.error ? props.theme.color.red : props.theme.color.blue)};
        box-shadow: 0 0 0 2px ${getInputFocusColor};
    }

    :not(select):read-only {
        background-color: ${props => props.theme.color.greyLightest};
    }
`;
