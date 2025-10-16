import { forwardRef, useState } from "react";
import Input from "./Input";
import InputContainer from "./InputContainer";
import InputIconButton from "./InputIconButton";

type InputPasswordProps = {
    id: string;
    name: string;
    autoComplete?: string;
};

const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
    (props, ref) => {
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
    },
);

InputPassword.displayName = "InputPassword";

export default InputPassword;
