import { cn } from "@app/cn";
import type { ReactNode } from "react";

type ButtonGroupProps = {
	/** Names the group as a whole, for a set whose purpose its members do not say */
	"aria-label"?: string;

	/** The buttons to join, in the order they are shown */
	children: ReactNode;

	className?: string;
};

/**
 * Joins related buttons into a single control.
 *
 * Members keep whatever they already are — a `Button`, a `ButtonToggle`, a
 * dropdown trigger — and the group squares off the corners between them so only
 * the outer two stay rounded. Anything that renders no element of its own, such
 * as a Radix `Root` or a portalled menu, does not count as a member: the seams
 * are drawn with `:first-child` / `:last-child`, which see the DOM rather than
 * the JSX.
 *
 * Members do not share roving focus — each is tabbed to in turn, as in shadcn.
 * Reach for a Radix `Toolbar` if a group grows long enough to want one stop.
 */
export default function ButtonGroup({
	"aria-label": ariaLabel,
	children,
	className,
}: ButtonGroupProps) {
	return (
		// biome-ignore lint/a11y/useSemanticElements: a fieldset groups form controls, not a set of related buttons
		<div
			aria-label={ariaLabel}
			className={cn(
				"inline-flex",
				"items-stretch",
				"[&>*:not(:first-child)]:rounded-l-none",
				"[&>*:not(:last-child)]:rounded-r-none",
				// Our buttons are solid fills rather than outlines, so where shadcn
				// collapses a shared border this has to add one — otherwise two
				// adjacent gray buttons read as a single wide one. Translucent black
				// rather than a gray, so the seam holds its contrast on a blue or red
				// member as well.
				"[&>*:not(:first-child)]:border-l",
				"[&>*:not(:first-child)]:border-black/10",
				// A member's `hover:shadow-lg` would otherwise be painted under its
				// neighbour, clipping the shadow along the seam.
				"[&>*:hover]:relative",
				"[&>*:hover]:z-10",
				"[&>*:focus-visible]:relative",
				"[&>*:focus-visible]:z-10",
				className,
			)}
			role="group"
		>
			{children}
		</div>
	);
}
