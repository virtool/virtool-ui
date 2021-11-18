import { fillAlign, formatPathoscopeData, formatSequence, median, mergeCoverage } from "../utils";

describe("fillAlign()", () => {
    const align = [
        [0, 0],
        [5, 3],
        [7, 3],
        [10, 5],
        [12, 5],
        [16, 2],
        [19, 2],
        [20, 0]
    ];
    const length = 20;

    it("should return array of twenty zeros when align is undefined", () => {
        const result = fillAlign({ length });
        expect(result).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it("should return array filled based on align when it is defined", () => {
        const result = fillAlign({ align, length });
        expect(result).toEqual([0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 2, 2, 2, 2]);
    });
});

describe("formatSequence()", () => {
    it("should format a sequence record", () => {
        const align = [
            [0, 0],
            [5, 3],
            [7, 3],
            [8, 5],
            [10, 5]
        ];
        const sequence = {
            align,
            foo: "bar",
            length: 11,
            pi: 0.4
        };
        const result = formatSequence(sequence, 3000);
        expect(result).toEqual({
            align,
            filled: [0, 0, 0, 0, 0, 3, 3, 3, 5, 5, 5],
            foo: "bar",
            length: 11,
            pi: 0.4,
            reads: 1200
        });
    });
});

describe("formatPathoscopeData()", () => {
    it("should return plain detail when [results.length=0]", () => {
        const detail = {
            foo: "bar",
            results: []
        };
        const result = formatPathoscopeData(detail);
        expect(result).toEqual(detail);
    });
});

describe("median()", () => {
    it("should return median for odd-length list", () => {
        const values = [17, 18, 5, 7, 41, 52, 67, 22, 3];
        const result = median(values);
        expect(result).toBe(18);
    });

    it("should return median for even-length list", () => {
        const values = [17, 18, 5, 7, 41, 52, 67, 22];
        const result = median(values);
        expect(result).toBe(20);
    });

    it("should return median for even-length list with rounding", () => {
        const values = [17, 18, 5, 7, 41, 52, 67, 21];
        const result = median(values);
        expect(result).toBe(20);
    });
});

describe("mergeCoverage()", () => {
    let isolates;

    beforeEach(() => {
        const coverages = [
            [1, 5, 5, 6, 6, 7, 9, 3, 2, 2, 1, 0, 0, 0, 1, 2, 1],
            [7, 5, 5, 1, 1, 2, 1, 5, 6, 2, 1, 0, 0, 0, 1, 3, 2],
            [1, 1, 2, 3, 4, 4, 4, 4, 2, 2, 2, 3, 2, 1, 0, 1, 0]
        ];
        isolates = coverages.map(c => ({ filled: c }));
    });

    it("should return merged coverage when all isolates have same length", () => {
        const merged = mergeCoverage(isolates);
        expect(merged).toEqual([7, 5, 5, 6, 6, 7, 9, 5, 6, 2, 2, 3, 2, 1, 1, 3, 2]);
    });

    it("should return merged coverage when isolate lengths differ", () => {
        isolates[0].filled.push(3);
        isolates[0].filled.push(5);
        isolates[2].filled.push(1);
        const merged = mergeCoverage(isolates);
        expect(merged).toEqual([7, 5, 5, 6, 6, 7, 9, 5, 6, 2, 2, 3, 2, 1, 1, 3, 2, 3, 5]);
    });
});
