import InputIcon from "./InputIcon";
import React from "react";
import Input from "./Input";
import InputContainer from "./InputContainer";

type InputHandle = {
    blur: () => void;
    focus: () => void;
};

interface InputProps {
    "aria-label"?: string;
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

const InputSearch = React.forwardRef<InputHandle, InputProps>((props, ref) => (
    <InputContainer align="left" className="flex-grow">
        <Input {...props} ref={ref} />
        <InputIcon name="search" />
    </InputContainer>
));

InputSearch.displayName = "InputSearch";

export default InputSearch;
