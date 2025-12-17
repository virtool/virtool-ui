import { Ref, useState } from "react";
import Input from "./Input";
import InputContainer from "./InputContainer";
import InputIconButton from "./InputIconButton";

type InputPasswordProps = {
    id: string;
    name: string;
    autoComplete?: string;
    ref?: Ref<HTMLInputElement>;
};

export default function InputPassword({ ref, ...props }: InputPasswordProps) {
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
}
