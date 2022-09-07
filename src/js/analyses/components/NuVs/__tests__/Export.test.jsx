import { NuVsExport } from "../Export";
import { vi } from "vitest";

describe("<NuVsExport />", () => {
    it("renders correctly", () => {
        const props = {
            show: true,
            sampleName: "test-sample",
            analysisId: "test-analysis",
            results: [],
            onHide: vi.fn()
        };
        const wrapper = <NuVsExport {...props} />;
        expect(wrapper).toMatchSnapshot();
    });
});
