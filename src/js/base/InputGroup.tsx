import { cn } from "@utils/utils";
import React from "react";
import { InputContext } from "./InputContext";

type InputGroupProps = {
    children: React.ReactNode;
    className?: string;
    error?: string;
};

export default function InputGroup({
    children,
    className,
    error,
}: InputGroupProps) {
    return (
        <InputContext.Provider value={error}>
            <div className={cn(className, "mb-4", "pb-2")}>{children}</div>
        </InputContext.Provider>
    );
}
