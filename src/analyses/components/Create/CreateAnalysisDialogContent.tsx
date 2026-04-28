import { cn } from "@app/utils";
import { DialogContent } from "@base/Dialog";
import type { ReactNode } from "react";

export default function CreateAnalysisDialogContent({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<DialogContent
			className={cn("min-h-1/2", "max-h-[90vh]", "overflow-auto", "w-[700px]")}
		>
			<div className={cn("flex", "flex-col", "h-full")}>{children}</div>
		</DialogContent>
	);
}
