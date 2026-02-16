import { Search } from "lucide-react";
import { ReactNode, Ref } from "react";
import Input from "./Input";
import InputContainer from "./InputContainer";
import InputIcon from "./InputIcon";

type InputHandle = {
    blur: () => void;
    focus: () => void;
};

interface InputSearchProps {
    "aria-label"?: string;
    autoFocus?: boolean;
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    error?: string;
    id?: string;
    max?: number;
    min?: number;
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
    ref?: Ref<InputHandle>;
    step?: number;
    type?: string;
    value: string | number;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export default function InputSearch({ ref, ...props }: InputSearchProps) {
    return (
        <InputContainer align="left" className="flex-grow">
            <Input {...props} ref={ref} />
            <InputIcon size={18} icon={Search} />
        </InputContainer>
    );
}
