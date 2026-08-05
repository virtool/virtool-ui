import Box from "@base/Box";
import BoxGroupSection from "@base/BoxGroupSection";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@base/Empty";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useId } from "react";

type DashboardCardProps = {
	/** An optional link or button rendered opposite the title, e.g. "View all". */
	action?: ReactNode;

	/** The card body — a `BoxGroup` list, an empty state, or an error. */
	children: ReactNode;

	/** The card's heading. */
	title: string;
};

/**
 * A titled section of the dashboard.
 *
 * Owns the heading row so every card has the same shape whether its body holds
 * a list, an empty state, or a failed query. The body is supplied whole,
 * because a list is a `BoxGroup as="ul"` and the other two are not lists.
 */
export default function DashboardCard({
	action,
	children,
	title,
}: DashboardCardProps) {
	const headingId = useId();

	return (
		<section aria-labelledby={headingId}>
			<header className="flex items-baseline justify-between mb-3">
				<h2 className="text-xl font-medium" id={headingId}>
					{title}
				</h2>
				{action}
			</header>
			{children}
		</section>
	);
}

type DashboardCardEmptyProps = {
	/** Optional secondary line explaining why the card is empty. */
	description?: ReactNode;

	/** The muted icon shown beside the title. */
	icon: LucideIcon;

	/** The primary line, announced by assistive technology. */
	title: ReactNode;
};

/**
 * The empty state for a dashboard card.
 *
 * Deliberately shorter and horizontal where `ListEmpty` is a tall centred
 * block — several of these stack on one screen, and a full-height empty state
 * per card would push everything below the fold.
 */
export function DashboardCardEmpty({
	description,
	icon: Icon,
	title,
}: DashboardCardEmptyProps) {
	return (
		<Box className="mb-0">
			<Empty className="py-4" orientation="horizontal">
				<EmptyMedia className="text-gray-400">
					<Icon size={24} strokeWidth={1.5} />
				</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				{description && <EmptyDescription>{description}</EmptyDescription>}
			</Empty>
		</Box>
	);
}

type DashboardCardMoreProps = {
	/** The overflow line — a link where there is somewhere to send the reader. */
	children: ReactNode;
};

/**
 * The last row of a dashboard card's list, accounting for the rows the card
 * does not have room for.
 *
 * Sits inside the same `BoxGroup` as the rows it follows, so a card that is
 * showing everything simply ends at its last row with nothing to explain.
 */
export function DashboardCardMore({ children }: DashboardCardMoreProps) {
	return (
		<BoxGroupSection
			as="li"
			className="bg-gray-50 text-center text-gray-600 text-sm"
		>
			{children}
		</BoxGroupSection>
	);
}
