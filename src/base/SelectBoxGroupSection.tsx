import { cn } from "@app/utils";
import type { KeyboardEvent, ReactNode } from "react";
import BoxGroupSection from "./BoxGroupSection";

type SelectBoxGroupSectionProps = {
	active?: boolean;
	children: ReactNode;
	className?: string;
	onClick?: () => void;
};

export default function SelectBoxGroupSection({
	active,
	children,
	className,
	onClick,
}: SelectBoxGroupSectionProps) {
	function onKeyDown(e: KeyboardEvent) {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onClick?.();
		}
	}

	return (
		<BoxGroupSection
			active={active}
			aria-selected={active}
			className={cn(
				"cursor-pointer",
				"w-full",
				"focus:ring-2",
				"focus:ring-inset",
				"focus:ring-blue-600/50",
				"focus:outline-none",
				className,
			)}
			onClick={onClick}
			onKeyDown={onKeyDown}
			role="option"
			tabIndex={0}
		>
			{children}
		</BoxGroupSection>
	);
}
