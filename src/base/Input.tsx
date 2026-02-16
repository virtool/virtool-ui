import { cn } from "@app/utils";
import {
    ElementType,
    ReactNode,
    Ref,
    useContext,
    useImperativeHandle,
    useRef,
} from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import InputContext from "./InputContext";

type InputHandle = {
    blur: () => void;
    focus: () => void;
};

export interface InputProps {
    "aria-label"?: string;
    as?: ElementType;
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
    register?: UseFormRegisterReturn;
    step?: number;
    type?: string;
    value?: string | number;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onChange?: (event: React.ChangeEvent) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export default function Input({
    "aria-label": ariaLabel,
    as: Component = "input",
    autoFocus = false,
    children,
    className = "",
    disabled = false,
    error: errorProp,
    id,
    max,
    min,
    name,
    placeholder,
    readOnly = false,
    ref,
    register,
    step,
    type,
    value,
    onBlur,
    onChange,
    onFocus,
}: InputProps) {
    const errorContext = useContext(InputContext);
    const error = errorProp || errorContext;

    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        blur: () => {
            inputRef.current?.blur();
        },
        focus: () => {
            inputRef.current?.focus();
        },
    }));

    return (
        <Component
            aria-label={ariaLabel}
            ref={inputRef}
            autoFocus={autoFocus}
            className={cn(
                "bg-white border rounded-[3px] shadow-[inset_0_1px_1px_rgba(0,0,0,0.075)] block text-sm h-auto outline-none py-2 px-2.5 relative transition-all duration-150 ease-in-out w-full",
                error
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/50"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50",
                {
                    "read-only:bg-gray-100": Component !== "select",
                },
                className,
            )}
            disabled={disabled}
            id={id}
            max={max}
            min={min}
            name={name}
            placeholder={placeholder}
            readOnly={readOnly}
            step={step}
            type={type}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            {...register}
        >
            {children}
        </Component>
    );
}

Input.displayName = "Input";
