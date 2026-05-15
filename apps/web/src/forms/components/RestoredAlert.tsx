import Alert from "@base/Alert";
import IconButton from "@base/IconButton";
import { Undo2, X } from "lucide-react";
import { useState } from "react";

export type RestoredAlertProps = {
	/* Whether the form has been restored from cached values */
	hasRestored: boolean;
	/* the display name of the resource */
	name: string;
	/* undo the restoration and restore the form to its initial state */
	resetForm: () => void;
};

/** Alert informing users of form data restoration */
export function RestoredAlert({
	hasRestored,
	name,
	resetForm,
}: RestoredAlertProps) {
	const [dismissed, setDismissed] = useState(false);

	function onUndoRestore() {
		resetForm();
		setDismissed(true);
	}

	const show = hasRestored && !dismissed;

	return (
		show && (
			<Alert className="items-center">
				<span>Resumed editing draft {name}.</span>
				<IconButton
					className="ml-2.5"
					IconComponent={Undo2}
					color="gray"
					tip="undo restore"
					onClick={onUndoRestore}
				/>
				<IconButton
					className="ml-auto"
					IconComponent={X}
					color="gray"
					tip="close"
					onClick={() => setDismissed(true)}
				/>
			</Alert>
		)
	);
}
