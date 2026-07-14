/**
 * Number formatting.
 *
 * Kept apart from `@app/utils` because numbro is ~38 KB and does not declare
 * `sideEffects: false`, so its import survives tree-shaking even when only
 * unrelated exports of the importing module are used. Co-locating these with
 * the general utilities put numbro into every bundle that wanted, say,
 * `resetClient`.
 */
import numbro from "numbro";

/**
 * Convert an integer in bytes to a nicely formatted string (eg. 10.2 GB).
 */
export function byteSize(
	bytes: number | null,
	spaceSeparated: boolean = false,
): string {
	if (bytes) {
		return numbro(bytes).format({
			output: "byte",
			base: "decimal",
			mantissa: 1,
			spaceSeparated: spaceSeparated ? spaceSeparated : false,
		});
	}

	return "0.0B";
}

export function toThousand(num: number): string {
	return numbro(num).format({ thousandSeparated: true });
}

/**
 * Converts a ``number`` to a scientific notation string.
 */
export function toScientificNotation(num: number): string {
	if (num < 0.01 || num > 1000) {
		const [coefficient, exponent] = num.toExponential().split("e");
		return `${numbro(coefficient).format("0.00")}E${(exponent ?? "").replace("+", "")}`;
	}

	return numbro(num).format("0.000");
}
