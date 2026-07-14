import { cn } from "@app/cn";
import { DialogContent } from "@base/Dialog";
import type { ReactNode } from "react";

export default function CreateAnalysisDialogContent({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<DialogContent className={cn("max-h-[90vh]", "overflow-auto", "w-[700px]")}>
			<div className={cn("flex", "flex-col")}>{children}</div>
		</DialogContent>
	);
}
