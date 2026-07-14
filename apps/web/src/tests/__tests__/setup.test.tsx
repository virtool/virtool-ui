import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import { useEffect, useState } from "react";
import { describe, expect, it } from "vitest";

let mountCount = 0;

function MountCounter({ label }: { label: string }) {
	const [renderedAt] = useState(() => label);

	useEffect(() => {
		mountCount += 1;
	}, []);

	return (
		<span>
			{label} first rendered as {renderedAt}
		</span>
	);
}

describe("renderWithProviders", () => {
	it("should re-render rather than remount when rerender is called", () => {
		mountCount = 0;

		const { rerender } = renderWithProviders(<MountCounter label="one" />);
		expect(mountCount).toBe(1);

		rerender(<MountCounter label="two" />);

		// A remount would run the effect again and reinitialise the state, so the
		// component would claim it first rendered as "two".
		expect(mountCount).toBe(1);
		expect(
			screen.getByText("two first rendered as one", { exact: false }),
		).toBeInTheDocument();
	});
});
