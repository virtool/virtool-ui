import React from "react";
import { Input } from "./Input";

type InputSelectProps = {
    children: React.ReactNode;
    name?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const InputSelect = ({ children, name, value, onChange }: InputSelectProps) => {
    return (
        <Input as="select" name={name} value={value || ""} onChange={onChange}>
            {children}
        </Input>
    );
};
