import { InputIcon } from "@base/InputIcon";
import React from "react";
import { Loader } from "./Loader";

export const InputLoading = () => (
    <InputIcon name="loading" as="div">
        <Loader size="14px" />
    </InputIcon>
);
