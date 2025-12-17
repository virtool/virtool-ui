import { ReactNode, Ref } from "react";
import Input from "./Input";

type InputSelectProps = {
    children: ReactNode;
    id?: string;
    name?: string;
    ref?: Ref<HTMLSelectElement>;
    value?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function InputSelect({
    children,
    id,
    name,
    ref,
    value,
    onChange,
}: InputSelectProps) {
    return (
        <Input
            as="select"
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            ref={ref}
        >
            {children}
        </Input>
    );
}
