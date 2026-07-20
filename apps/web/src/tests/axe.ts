import axe, { type Result, type RunOptions } from "axe-core";

/** Render axe violations into a readable, indented block for the failure message. */
export function formatViolations(violations: Result[]): string {
	return violations
		.map((violation) => {
			const nodes = violation.nodes
				.map((node) => {
					const summary = node.failureSummary
						? `\n    ${node.failureSummary.replace(/\n/g, "\n    ")}`
						: "";
					return `  - ${node.html}${summary}`;
				})
				.join("\n");

			return `${violation.id} (${violation.impact ?? "unknown"}): ${violation.help}\n  ${violation.helpUrl}\n${nodes}`;
		})
		.join("\n\n");
}

/**
 * Assert that `container` has no axe-core accessibility violations.
 *
 * Opt-in per test rather than run automatically inside `renderWithProviders`,
 * so adding the harness does not fail every existing test at once and each
 * barrier can be fixed incrementally. Pass the element returned by a render
 * helper — usually `baseElement` — or any subtree to scope the check.
 *
 * `color-contrast` needs a layout engine to compute rendered colours, and
 * jsdom has none — the rule either throws or reports noise, so it is checked
 * in a real browser instead (VIR-2693 / VIR-2746). It stays disabled unless a
 * caller re-enables it explicitly through `options.rules`; other options merge
 * over the defaults.
 */
export async function expectNoViolations(
	container: Element,
	options: RunOptions = {},
): Promise<void> {
	const { violations } = await axe.run(container, {
		...options,
		rules: { "color-contrast": { enabled: false }, ...options.rules },
	});

	if (violations.length > 0) {
		throw new Error(
			`expected no accessibility violations, found ${violations.length}:\n\n${formatViolations(violations)}`,
		);
	}
}
