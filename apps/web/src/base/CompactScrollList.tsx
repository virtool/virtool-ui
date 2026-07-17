import { cn } from "@app/cn";
import type {
	FetchNextPageOptions,
	InfiniteQueryObserverResult,
} from "@tanstack/react-query/";
import type { ComponentPropsWithRef, ReactElement, UIEvent } from "react";
import LoadingPlaceholder from "./LoadingPlaceholder";

function getScrollRatio(scrollListElement: HTMLElement): number {
	return Math.round(
		(scrollListElement.scrollTop + scrollListElement.clientHeight) /
			scrollListElement.scrollHeight,
	);
}

type CompactScrollListProps = ComponentPropsWithRef<"div"> & {
	/** A function which initiates fetching the next page */
	fetchNextPage: (
		options?: FetchNextPageOptions,
	) => Promise<InfiniteQueryObserverResult>;

	/** Whether a new page is being fetched */
	isFetchingNextPage: boolean;

	/** Whether the first page is being fetched */
	isPending: boolean;

	/** The list of items */
	items: unknown[];

	/** A function which accepts an item and returns a React element */
	renderRow: (item: unknown) => ReactElement;
};

/**
 * An infinitely scrolling list of items.
 *
 * The container carries no ARIA role of its own — it is a plain scroll region.
 * Callers that are genuine listboxes pass listbox props (`role`, `tabIndex`,
 * `aria-activedescendant`, `onKeyDown`) through, e.g. via `useListboxNavigation`.
 */
export default function CompactScrollList({
	className,
	fetchNextPage,
	isFetchingNextPage,
	isPending,
	items,
	renderRow,
	onScroll,
	...props
}: CompactScrollListProps) {
	function handleScroll(e: UIEvent<HTMLDivElement>) {
		onScroll?.(e);

		const scrollListElement = e.target as HTMLElement;
		if (getScrollRatio(scrollListElement) > 0.8 && !isFetchingNextPage) {
			void fetchNextPage();
		}
	}

	const entries = items.map((item) => renderRow(item));

	return (
		<div
			className={cn(
				"mb-2",
				"relative",
				"z-0",
				"overflow-y-auto",
				"border",
				"rounded-md",
				className,
			)}
			onScroll={handleScroll}
			{...props}
		>
			{entries}
			{isPending && <LoadingPlaceholder className="mt-5" />}
		</div>
	);
}
