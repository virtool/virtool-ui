import type { ReactNode } from "react";

type CreateAnalysisFieldProps = {
	children: ReactNode;
};

export default function CreateAnalysisField({
	children,
}: CreateAnalysisFieldProps) {
	return (
		<div className="grid grid-cols-2 items-stretch gap-x-4 mb-8">
			{children}
		</div>
	);
}
