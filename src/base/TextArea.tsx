import { ElementType, ReactNode, Ref } from "react";
import styled from "styled-components";
import Input from "./Input";

const StyledTextArea = styled(Input)`
    height: 220px;
    resize: vertical;
    overflow-y: scroll;
`;

type TextAreaProps = {
    "aria-label"?: string;
    as?: ElementType;
    children?: ReactNode;
    className?: string;
    error?: string;
    id?: string;
    name?: string;
    readOnly?: boolean;
    ref?: Ref<HTMLInputElement>;
    value?: string | number;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TextArea({ ref, ...props }: TextAreaProps) {
    return <StyledTextArea as="textarea" {...props} ref={ref} />;
}
