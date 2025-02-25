import React from "react";

type InputLabelProps = {
    children: React.ReactNode;
    htmlFor?: string;
};

export default function InputLabel({ children, htmlFor }: InputLabelProps) {
    return (
        <label htmlFor={htmlFor} className="font-medium">
            {children}
        </label>
    );
}
