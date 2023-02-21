import { InputIcon } from "./InputIcon";
import React from "react";
import { Input } from "./Input";
import { InputContainer } from "./InputContainer";

export const InputSearch = props => (
    <InputContainer align="left">
        <Input {...props} />
        <InputIcon name="search" />
    </InputContainer>
);
