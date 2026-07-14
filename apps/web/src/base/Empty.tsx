import { cn } from "@app/cn";
import type { ReactNode } from "react";

type EmptyProps = {
	children: ReactNode;
	className?: string;
	orientation?: "vertical" | "horizontal";
};

/**
 * A centered empty, error, or not-found state assembled from the composable
 * `Empty*` pieces below.
 *
 * `Empty` owns only the centered layout — it deliberately carries no fixed
 * height, border, or background so a compact list empty-state and a full-route
 * error can share it. Use `orientation="vertical"` (the default) to stack the
 * icon above the text for a prominent, standalone view, or `"horizontal"` for a
 * compact single-row state that reads well inside a `Box` or `BoxGroupSection`.
 * Compose `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, and `EmptyContent`
 * inside it, and add the container or sizing (`h-96`) the surrounding view
 * needs via `className` or a wrapper.
 */
export function Empty({
	children,
	className,
	orientation = "vertical",
}: EmptyProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-center text-center",
				orientation === "vertical" ? "flex-col gap-4" : "flex-row gap-2",
				className,
			)}
		>
			{children}
		</div>
	);
}

type EmptyMediaProps = {
	children: ReactNode;
	className?: string;
};

/**
 * The decorative visual slot (usually an icon) at the top of an `Empty` state.
 *
 * Hidden from assistive technology — the `EmptyTitle` carries the meaning, so
 * the icon is presentational. Size and color the icon itself; this slot is a
 * neutral styling hook.
 */
export function EmptyMedia({ children, className }: EmptyMediaProps) {
	return (
		<div aria-hidden="true" className={className}>
			{children}
		</div>
	);
}

type EmptyTitleProps = {
	children: ReactNode;
	className?: string;
};

/** The primary line of an `Empty` state — the one screen readers announce. */
export function EmptyTitle({ children, className }: EmptyTitleProps) {
	return <p className={cn("text-base font-semibold", className)}>{children}</p>;
}

type EmptyDescriptionProps = {
	children: ReactNode;
	className?: string;
};

/** Optional secondary text below an `EmptyTitle`. */
export function EmptyDescription({
	children,
	className,
}: EmptyDescriptionProps) {
	return <p className={cn("text-sm text-gray-500", className)}>{children}</p>;
}

type EmptyContentProps = {
	children: ReactNode;
	className?: string;
};

/** Slot for recovery actions (e.g. a "Try again" button) beneath the text. */
export function EmptyContent({ children, className }: EmptyContentProps) {
	return (
		<div className={cn("flex flex-col items-center gap-2", className)}>
			{children}
		</div>
	);
}
