import { ReactNode } from "react";
type InputLabelProps = {
    children: ReactNode;
    htmlFor?: string;
    id?: string;
};

export default function InputLabel({ children, htmlFor, id }: InputLabelProps) {
    return (
        <label htmlFor={htmlFor} id={id} className="font-medium">
            {children}
        </label>
    );
}
