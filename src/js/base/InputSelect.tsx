import React from "react";
import { Input } from "./Input";

type InputSelectProps = {
    children: React.ReactNode;
    id?: string;
    name?: string;
    value?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const InputSelect = ({ children, id, name, value, onChange }: InputSelectProps) => {
    return (
        <Input as="select" id={id} name={name} value={value} onChange={onChange}>
            {children}
        </Input>
    );
};
