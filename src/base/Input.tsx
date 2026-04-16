import { cn } from "@app/utils";
import { type ElementType, type ReactNode, type Ref, useContext } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import InputContext from "./InputContext";
import {
	inputBaseClasses,
	inputErrorClasses,
	inputFocusClasses,
} from "./styles";

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
	ref?: Ref<any>;
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
	step,
	type,
	value,
	onBlur,
	onChange,
	onFocus,
}: InputProps) {
	const errorContext = useContext(InputContext);
	const error = errorProp || errorContext;

	return (
		<Component
			aria-label={ariaLabel}
			ref={ref}
			autoFocus={autoFocus}
			className={cn(
				inputBaseClasses,
				error ? inputErrorClasses : inputFocusClasses,
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
		>
			{children}
		</Component>
	);
}

Input.displayName = "Input";
