import { cn } from "@app/cn";
import type { ComponentPropsWithRef } from "react";
import {
	inputBaseClasses,
	inputFocusClasses,
	inputHeightClass,
	inputInvalidClasses,
} from "./styles";

export type InputSimpleProps = ComponentPropsWithRef<"input"> & {
	className?: string;
	as?: string;
};

export default function InputSimple({ className, ...props }: InputSimpleProps) {
	return (
		<input
			className={cn(
				inputBaseClasses,
				inputHeightClass,
				inputFocusClasses,
				inputInvalidClasses,
				"read-only:bg-gray-100",
				className,
			)}
			{...props}
		/>
	);
}
