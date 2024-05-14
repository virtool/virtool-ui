import { InputContainer } from "@base/InputContainer";
import { InputIcon } from "@base/InputIcon";
import React, { useState } from "react";
import { Input } from "./Input";

type InputPasswordProps = {
    id: string;
    name: string;
};

export const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>((props, ref) => {
    const [show, setShow] = useState(false);

    return (
        <InputContainer>
            <Input as="input" {...props} ref={ref} type={show ? "" : "password"} />
            <InputIcon name={show ? "eye-slash" : "eye"} onClick={() => setShow(prevShow => !prevShow)} />
        </InputContainer>
    );
});
