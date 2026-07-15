/**
 * Number formatting built on the native `Intl.NumberFormat` API.
 *
 * Kept apart from `@app/utils` so these formatters — and the `Intl` formatter
 * instances they cache at module scope — stay out of bundles that only want an
 * unrelated general utility.
 */

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

const byteFormatter = new Intl.NumberFormat("en-US", {
	minimumFractionDigits: 1,
	maximumFractionDigits: 1,
	useGrouping: false,
});

const thousandFormatter = new Intl.NumberFormat("en-US", {
	maximumFractionDigits: 0,
});

const coefficientFormatter = new Intl.NumberFormat("en-US", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
	useGrouping: false,
});

const decimalFormatter = new Intl.NumberFormat("en-US", {
	minimumFractionDigits: 3,
	maximumFractionDigits: 3,
	useGrouping: false,
});

/**
 * Convert an integer in bytes to a nicely formatted string (eg. 10.2 GB).
 */
export function byteSize(
	bytes: number | null,
	spaceSeparated: boolean = false,
): string {
	if (!bytes) {
		return "0.0B";
	}

	const exponent = Math.min(
		Math.floor(Math.log10(Math.abs(bytes)) / 3),
		BYTE_UNITS.length - 1,
	);
	const value = bytes / 1000 ** exponent;
	const separator = spaceSeparated ? " " : "";

	return `${byteFormatter.format(value)}${separator}${BYTE_UNITS[exponent]}`;
}

export function toThousand(num: number): string {
	return thousandFormatter.format(num);
}

/**
 * Converts a ``number`` to a scientific notation string.
 */
export function toScientificNotation(num: number): string {
	if (num < 0.01 || num > 1000) {
		const [coefficient, exponent] = num.toExponential().split("e");
		return `${coefficientFormatter.format(Number(coefficient))}E${(exponent ?? "").replace("+", "")}`;
	}

	return decimalFormatter.format(num);
}
