import type { ReactNode } from "react";

type CreateAnalysisFieldTitleProps = {
	children: ReactNode;
};

export default function CreateAnalysisFieldTitle({
	children,
}: CreateAnalysisFieldTitleProps) {
	return <div className="col-span-2 text-base mb-2.5">{children}</div>;
}
