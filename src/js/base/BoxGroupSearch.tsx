import { InputContainer } from "@base/InputContainer";
import { InputIconButton } from "@base/InputIconButton";
import React from "react";
import { BoxGroupSection } from "./BoxGroupSection";
import { Input } from "./Input";

type BoxGroupSearchProps = {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    autoFocus?: boolean;
};

export function BoxGroupSearch({
    label,
    placeholder = "",
    value,
    onChange,
    autoFocus = false,
}: BoxGroupSearchProps) {
    return (
        <BoxGroupSection>
            <InputContainer align="right">
                <Input
                    value={value}
                    placeholder={placeholder}
                    aria-label={label}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onChange(e.target.value)
                    }
                    autoFocus={autoFocus}
                />
                <InputIconButton
                    className="flex justify-center justify-items-center absolute ml-auto"
                    name="times fa-fw"
                    tip="Clear"
                    color="grayDark"
                    onClick={() => onChange("")}
                    aria-label="clear"
                />
            </InputContainer>
        </BoxGroupSection>
    );
}
