import { describe, expect, it } from "vitest";
import {
	byteSize,
	toGcContent,
	toScientificNotation,
	toThousand,
} from "../format";
import { createRandomString, formatIsolateName } from "../utils.js";

describe("byteSize()", () => {
	it("should convert 1 to 1.0B", () => {
		const result = byteSize(1);
		expect(result).toEqual("1.0B");
	});

	it("should convert 1024000 to 1.0MB", () => {
		const result = byteSize(1024000);
		expect(result).toEqual("1.0MB");
	});

	it("should convert 1024 to 1.0KB", () => {
		const result = byteSize(1024);
		expect(result).toEqual("1.0KB");
	});

	it("should convert 0 to 0.0B", () => {
		const result = byteSize(0);
		expect(result).toEqual("0.0B");
	});

	it("should convert NaN to 0.0B", () => {
		const result = byteSize(NaN);
		expect(result).toEqual("0.0B");
	});

	it("should convert null to 0.0B", () => {
		const result = byteSize(null);
		expect(result).toEqual("0.0B");
	});
});

describe("toThousand()", () => {
	it("should group thousands with commas", () => {
		expect(toThousand(1234)).toEqual("1,234");
	});

	it("should format millions", () => {
		expect(toThousand(1234567)).toEqual("1,234,567");
	});

	it("should leave values below 1000 ungrouped", () => {
		expect(toThousand(999)).toEqual("999");
	});

	it("should round to a whole number", () => {
		expect(toThousand(1234.6)).toEqual("1,235");
	});
});

describe("toScientificNotation()", () => {
	it("should use scientific notation for values below 0.01", () => {
		expect(toScientificNotation(0.001)).toEqual("1.00E-3");
	});

	it("should use scientific notation for values above 1000", () => {
		expect(toScientificNotation(5000)).toEqual("5.00E3");
	});

	it("should use three decimal places for mid-range values", () => {
		expect(toScientificNotation(0.4123)).toEqual("0.412");
	});

	it("should not group the integer part of mid-range values", () => {
		expect(toScientificNotation(1000)).toEqual("1000.000");
	});
});

describe("toGcContent()", () => {
	it("should render a fraction as a one-decimal percentage", () => {
		expect(toGcContent(0.452)).toEqual("45.2%");
	});

	it("should round to one decimal place", () => {
		expect(toGcContent(0.4127)).toEqual("41.3%");
	});

	it("should handle a whole fraction", () => {
		expect(toGcContent(1)).toEqual("100.0%");
	});
});

describe("createRandomString()", () => {
	it("should return a string of length 8 by default", () => {
		const result = createRandomString();
		expect(result.length).toEqual(8);
	});

	it("should return a string of specified length", () => {
		const result = createRandomString(20);
		expect(result.length).toEqual(20);
	});
});

describe("formatIsolateName()", () => {
	it("should return 'Isolate ABCD' for named isolate", () => {
		const result = formatIsolateName({
			id: "testid",
			sequences: [],
			source_name: "ABCD",
			source_type: "isolate",
		});

		expect(result).toEqual("Isolate ABCD");
	});

	it("should return 'Unnamed' for isolate with source type unknown", () => {
		const result = formatIsolateName({
			id: "testid",
			sequences: [],
			source_name: "EFGH",
			source_type: "unknown",
		});

		expect(result).toEqual("Unnamed");
	});
});
