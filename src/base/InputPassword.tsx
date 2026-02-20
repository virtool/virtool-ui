import { Eye, EyeOff } from "lucide-react";
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
        <InputContainer className="flex flex-grow-1">
            <Input
                as="input"
                {...props}
                ref={ref}
                type={show ? "" : "password"}
            />
            <InputIconButton
                tip={show ? "Hide" : "Show"}
                IconComponent={show ? Eye : EyeOff}
                onClick={() => setShow((prevShow) => !prevShow)}
            />
        </InputContainer>
    );
}
