import { InputContainer } from "@base/InputContainer";
import { InputIconButton } from "@base/InputIconButton";
import React, { useState } from "react";
import { Input } from "./Input";

type InputPasswordProps = {
    id: string;
    name: string;
};

export const InputPassword = React.forwardRef<
    HTMLInputElement,
    InputPasswordProps
>((props, ref) => {
    const [show, setShow] = useState(false);

    return (
        <InputContainer>
            <Input
                as="input"
                {...props}
                ref={ref}
                type={show ? "" : "password"}
            />
            <InputIconButton
                tip={show ? "Hide" : "Show"}
                name={show ? "eye-slash" : "eye"}
                onClick={() => setShow((prevShow) => !prevShow)}
            />
        </InputContainer>
    );
});
