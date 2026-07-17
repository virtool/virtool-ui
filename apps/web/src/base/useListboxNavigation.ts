import {
	type KeyboardEvent,
	type RefObject,
	useId,
	useRef,
	useState,
} from "react";

/** The props to spread on the listbox container element. */
type ListboxProps = {
	ref: RefObject<HTMLDivElement | null>;
	role: "listbox";
	tabIndex: 0;
	"aria-activedescendant": string | undefined;
	onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
};

/** Keyboard navigation state for an ARIA listbox. */
type ListboxNavigation = {
	/** Props to spread on the listbox container. */
	listboxProps: ListboxProps;

	/** The DOM id of the active (highlighted) option, or undefined when none. */
	activeOptionId: string | undefined;

	/** Builds the DOM id of the option representing `key`. */
	getOptionId: (key: string | number) => string;
};

function clamp(value: number, max: number): number {
	return Math.max(0, Math.min(value, max));
}

/**
 * Drives keyboard navigation for a single-select ARIA listbox using the
 * `aria-activedescendant` pattern: focus stays on the container while the arrow,
 * Home, and End keys move a virtual cursor, and Enter or Space selects the
 * active option.
 *
 * The container owns the only tab stop; options are not individually focusable.
 * Spread `listboxProps` on the scroll container, tag each option element with
 * `id={getOptionId(key)}`, and highlight the one whose id equals
 * `activeOptionId`.
 */
export default function useListboxNavigation<T>(
	items: T[],
	getKey: (item: T) => string | number,
	onSelect: (item: T) => void,
): ListboxNavigation {
	const baseId = useId();
	const ref = useRef<HTMLDivElement>(null);
	const [activeKey, setActiveKey] = useState<string | number | null>(null);

	function getOptionId(key: string | number): string {
		return `${baseId}-${key}`;
	}

	const activeIndex = items.findIndex((item) => getKey(item) === activeKey);
	const activeItem = activeIndex >= 0 ? items[activeIndex] : undefined;
	const activeOptionId =
		activeItem === undefined ? undefined : getOptionId(getKey(activeItem));

	function moveTo(index: number) {
		const item = items[clamp(index, items.length - 1)];
		if (item === undefined) {
			return;
		}

		const key = getKey(item);
		setActiveKey(key);

		const optionElement = ref.current?.querySelector(
			`#${CSS.escape(getOptionId(key))}`,
		);
		optionElement?.scrollIntoView?.({ block: "nearest" });
	}

	function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				moveTo(activeIndex < 0 ? 0 : activeIndex + 1);
				break;
			case "ArrowUp":
				event.preventDefault();
				moveTo(activeIndex < 0 ? items.length - 1 : activeIndex - 1);
				break;
			case "Home":
				event.preventDefault();
				moveTo(0);
				break;
			case "End":
				event.preventDefault();
				moveTo(items.length - 1);
				break;
			case "Enter":
			case " ":
				if (activeItem !== undefined) {
					event.preventDefault();
					onSelect(activeItem);
				}
				break;
			default:
				break;
		}
	}

	return {
		listboxProps: {
			ref,
			role: "listbox",
			tabIndex: 0,
			"aria-activedescendant": activeOptionId,
			onKeyDown,
		},
		activeOptionId,
		getOptionId,
	};
}
