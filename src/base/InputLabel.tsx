import { ReactNode } from "react";
type InputLabelProps = {
    children: ReactNode;
    htmlFor?: string;
};

export default function InputLabel({ children, htmlFor }: InputLabelProps) {
    return (
        <label htmlFor={htmlFor} className="font-medium">
            {children}
        </label>
    );
}
