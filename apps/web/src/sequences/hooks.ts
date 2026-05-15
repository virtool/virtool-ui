import { useState } from "react";

type UseExpandedResult = {
	expanded: boolean;
	expand: () => void;
	collapse: () => void;
};

/**
 * A hook for managing sequence detail visibility.
 *
 * Provides a `expanded` boolean indicating visibility and functions for setting visibility: `expand()` and
 * `collapse()`.
 */
export function useExpanded(): UseExpandedResult {
	const [expanded, setExpanded] = useState(false);

	function expand() {
		setExpanded(true);
	}

	function collapse() {
		setExpanded(false);
	}

	return { expanded, expand, collapse };
}
