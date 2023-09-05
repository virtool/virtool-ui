import React, { useState } from "react";
import { Input } from "./Input";
import { InputContainer } from "./InputContainer";
import { InputIcon } from "./InputIcon";

export const InputPassword = props => {
    const [show, setShow] = useState(false);

    return (
        <InputContainer align="right">
            <Input name="password" aria-label="password" type={show ? "text" : "password"} {...props} />
            <InputIcon name={show ? "eye-slash" : "eye"} onClick={() => setShow(prevShow => !prevShow)} />
        </InputContainer>
    );
};
