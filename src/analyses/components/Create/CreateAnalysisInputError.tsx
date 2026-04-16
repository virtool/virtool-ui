import InputError from "@base/InputError";
import type { ReactNode } from "react";

type CreateAnalysisInputErrorProps = {
	children: ReactNode;
};

export function CreateAnalysisInputError({
	children,
}: CreateAnalysisInputErrorProps) {
	return <InputError className="-mt-6 mb-1">{children}</InputError>;
}
