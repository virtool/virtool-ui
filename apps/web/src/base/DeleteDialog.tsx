import { cn } from "@app/cn";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { type ReactNode, useState } from "react";
import Button from "./Button";

/** Pull a server-provided message off a rejected deletion, if there is one. */
function getDeleteErrorMessage(error: unknown): string {
	const message = (error as { response?: { body?: { message?: unknown } } })
		?.response?.body?.message;

	return typeof message === "string"
		? message
		: "Something went wrong. Please try again.";
}

type DeleteDialogProps = {
	/** The display name of the item being deleted */
	name: string;
	/** The type of item being deleted (e.g. "Sample"); titles the dialog "Delete {noun}" */
	noun: string;
	/** Overrides the default confirmation prompt */
	message?: ReactNode;
	/**
	 * Performs the deletion. Its result is awaited: a rejection renders inline
	 * and keeps the dialog open, while success closes it.
	 */
	onConfirm: () => unknown;
	/** A trigger that opens the dialog (e.g. a delete IconButton). Omit when controlling `open`. */
	trigger?: ReactNode;
	/** Controlled open state. Omit to let `trigger` manage it. */
	open?: boolean;
	/** Notified whenever the open state changes. */
	onOpenChange?: (open: boolean) => void;
};

/**
 * A dialog that confirms deletion of a document or other sensitive item. Built
 * on an alert dialog, so an outside click cannot dismiss it, and it renders any
 * error thrown by `onConfirm` inline.
 */
export default function DeleteDialog({
	name,
	noun,
	message,
	onConfirm,
	trigger,
	open: openProp,
	onOpenChange,
}: DeleteDialogProps) {
	const [openState, setOpenState] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isControlled = openProp !== undefined;
	const open = isControlled ? openProp : openState;

	function handleOpenChange(next: boolean) {
		if (!isControlled) {
			setOpenState(next);
		}
		if (!next) {
			setError(null);
		}
		onOpenChange?.(next);
	}

	async function handleConfirm() {
		try {
			setError(null);
			await onConfirm();
			handleOpenChange(false);
		} catch (caught) {
			setError(getDeleteErrorMessage(caught));
		}
	}

	return (
		<AlertDialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
			{trigger && (
				<AlertDialogPrimitive.Trigger asChild>
					{trigger}
				</AlertDialogPrimitive.Trigger>
			)}
			<AlertDialogPrimitive.Portal>
				<AlertDialogPrimitive.Overlay
					className={cn(
						"data-[state=open]:animate-overlayShow",
						"data-[state=closed]:animate-overlayHide",
						"bg-gray-500/60",
						"fixed",
						"inset-0",
						"z-overlay",
					)}
				/>
				<AlertDialogPrimitive.Content
					className={cn(
						"data-[state=open]:animate-contentShow",
						"data-[state=closed]:animate-contentHide",
						"fixed",
						"top-1/2",
						"left-1/2",
						"-translate-x-1/2",
						"-translate-y-1/2",
						"rounded-lg",
						"bg-white",
						"p-8",
						"shadow-2xl",
						"focus:outline-none",
						"z-dialog",
						"w-[600px]",
						"max-w-[90vw]",
						"max-h-[90vh]",
						"overflow-y-auto",
					)}
				>
					<AlertDialogPrimitive.Title className="font-medium pb-4 text-2xl">
						{`Delete ${noun}`}
					</AlertDialogPrimitive.Title>
					<AlertDialogPrimitive.Description asChild>
						{message ?? (
							<span>
								Are you sure you want to delete <strong>{name}</strong>?
							</span>
						)}
					</AlertDialogPrimitive.Description>
					{error && (
						<p role="alert" className="mt-4 text-red-600">
							{error}
						</p>
					)}
					<div className="flex justify-end gap-2 pt-4 pb-1">
						<AlertDialogPrimitive.Cancel asChild>
							<Button color="gray">Cancel</Button>
						</AlertDialogPrimitive.Cancel>
						<Button color="red" onClick={handleConfirm}>
							Confirm
						</Button>
					</div>
				</AlertDialogPrimitive.Content>
			</AlertDialogPrimitive.Portal>
		</AlertDialogPrimitive.Root>
	);
}
