import { cn } from "@app/utils";
import type { ReactNode } from "react";
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
	return (
		<BoxGroupSection
			active={active}
			aria-role="option"
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
		>
			{children}
		</BoxGroupSection>
	);
}
