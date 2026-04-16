import { DialogFooter } from "@base/Dialog";
import type { ReactNode } from "react";

type CreateAnalysisFooterProps = {
	children: ReactNode;
};

export function CreateAnalysisFooter({ children }: CreateAnalysisFooterProps) {
	return (
		<DialogFooter className="items-center justify-between mt-2.5 [&_button]:ml-auto">
			{children}
		</DialogFooter>
	);
}
