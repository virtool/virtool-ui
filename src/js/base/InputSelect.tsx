import React from "react";
import { Input } from "./Input";

type InputSelectProps = {
    "aria-label"?: string;
    children: React.ReactNode;
    name?: string;
    value?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const InputSelect = ({ children, name, value, onChange, ...props }: InputSelectProps) => {
    return (
        <Input as="select" aria-label={props["aria-label"]} name={name} value={value} onChange={onChange}>
            {children}
        </Input>
    );
};
