import { type Dispatch, type SetStateAction, useState } from "react";

/** A stable key identifying a selectable item — a string or numeric id. */
type SelectionKey = string | number;

/** Options for {@link useListSelection}. */
type UseListSelectionOptions<T> = {
	/** Derives the stable key used to identify and dedupe an item. */
	getKey: (item: T) => SelectionKey;

	/** When this value changes, the selection and the range anchor are reset. */
	resetKey?: unknown;
};

/** Options passed when selecting an item. */
type SelectOptions<T> = {
	/** Whether the shift modifier was held, requesting a range extension. */
	shiftKey: boolean;

	/** The items currently rendered, in display order; the range operates over these. */
	visibleItems: T[];
};

/** A headless multi-select for a list, with shift-click range selection. */
type ListSelection<T> = {
	/** The selected items, surviving changes to the visible items. */
	selected: T[];

	/** The keys of the selected items. */
	selectedKeys: Set<SelectionKey>;

	/** Whether an item is currently selected. */
	isSelected: (item: T) => boolean;

	/** Toggle an item, or extend the range from the anchor when shift is held. */
	select: (item: T, options: SelectOptions<T>) => void;

	/** Toggle every visible item as a group, leaving off-page selections alone. */
	toggleVisible: (visibleItems: T[]) => void;

	/** The tri-state of a select-all control over the visible items. */
	getVisibleState: (visibleItems: T[]) => boolean | "indeterminate";

	/** Replace the selection, e.g. to patch items after a mutation. */
	setSelected: Dispatch<SetStateAction<T[]>>;

	/** Clear the selection and the range anchor. */
	clear: () => void;
};

/**
 * Manages multi-selection for a list of items, including shift-click range
 * selection anchored on the last clicked row.
 *
 * Selection follows the additive checkbox-list convention (Gmail, GitHub): a
 * shift-click applies the clicked row's resulting checked state to every item
 * between the anchor and the clicked row, and never disturbs selections outside
 * that range — so selections made on other pages survive.
 */
export function useListSelection<T>({
	getKey,
	resetKey,
}: UseListSelectionOptions<T>): ListSelection<T> {
	const [selected, setSelected] = useState<T[]>([]);
	const [anchorKey, setAnchorKey] = useState<SelectionKey | null>(null);
	const [previousResetKey, setPreviousResetKey] = useState(resetKey);

	if (previousResetKey !== resetKey) {
		setPreviousResetKey(resetKey);
		setSelected([]);
		setAnchorKey(null);
	}

	const selectedKeys = new Set(selected.map(getKey));

	function isSelected(item: T): boolean {
		return selectedKeys.has(getKey(item));
	}

	function select(item: T, { shiftKey, visibleItems }: SelectOptions<T>) {
		const clickedKey = getKey(item);
		const anchorIndex =
			anchorKey === null
				? -1
				: visibleItems.findIndex(
						(candidate) => getKey(candidate) === anchorKey,
					);
		const clickedIndex = visibleItems.findIndex(
			(candidate) => getKey(candidate) === clickedKey,
		);

		setAnchorKey(clickedKey);

		if (!shiftKey || anchorIndex === -1 || clickedIndex === -1) {
			setSelected((previous) =>
				previous.some((candidate) => getKey(candidate) === clickedKey)
					? previous.filter((candidate) => getKey(candidate) !== clickedKey)
					: [...previous, item],
			);
			return;
		}

		const start = Math.min(anchorIndex, clickedIndex);
		const end = Math.max(anchorIndex, clickedIndex);
		const range = visibleItems.slice(start, end + 1);
		const rangeKeys = new Set(range.map(getKey));
		const shouldSelect = !selectedKeys.has(clickedKey);

		setSelected((previous) => {
			if (shouldSelect) {
				const existingKeys = new Set(previous.map(getKey));
				return [
					...previous,
					...range.filter((candidate) => !existingKeys.has(getKey(candidate))),
				];
			}

			return previous.filter((candidate) => !rangeKeys.has(getKey(candidate)));
		});
	}

	function toggleVisible(visibleItems: T[]) {
		const visibleKeys = new Set(visibleItems.map(getKey));
		const allSelected = visibleItems.every((item) =>
			selectedKeys.has(getKey(item)),
		);

		setSelected((previous) =>
			allSelected
				? previous.filter((item) => !visibleKeys.has(getKey(item)))
				: [
						...previous,
						...visibleItems.filter((item) => !selectedKeys.has(getKey(item))),
					],
		);
	}

	function getVisibleState(visibleItems: T[]): boolean | "indeterminate" {
		const selectedCount = visibleItems.filter((item) =>
			selectedKeys.has(getKey(item)),
		).length;

		if (selectedCount === 0) {
			return false;
		}

		return selectedCount === visibleItems.length ? true : "indeterminate";
	}

	function clear() {
		setSelected([]);
		setAnchorKey(null);
	}

	return {
		selected,
		selectedKeys,
		isSelected,
		select,
		toggleVisible,
		getVisibleState,
		setSelected,
		clear,
	};
}
