import React from "react";
import { InputIcon } from "./InputIcon";
import { Loader } from "./Loader";

export const InputLoading = () => (
    <InputIcon as="div">
        <Loader size="14px" />
    </InputIcon>
);
