import { cn } from "@app/utils";
import type { ElementType, ReactNode, Ref } from "react";
import Input from "./Input";

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

export default function TextArea({ className, ref, ...props }: TextAreaProps) {
	return (
		<Input
			as="textarea"
			className={cn("h-56 resize-y overflow-y-scroll", className)}
			{...props}
			ref={ref}
		/>
	);
}
