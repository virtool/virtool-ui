import { screen } from "@testing-library/react";
import { createFakeSample, mockApiGetSampleDetail } from "@tests/fake/samples";
import { renderWithMemoryRouter } from "@tests/setupTests";
import numbro from "numbro";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import SampleDetailGeneral from "../SampleDetailGeneral";

describe("<SampleDetailGeneral />", () => {
    let props;
    let sample;

    beforeEach(() => {
        sample = createFakeSample({ paired: true });
        props = {
            match: { params: { sampleId: sample.id } },
        };
    });

    it("should render properly when data is installing", async () => {
        const unreadySample = createFakeSample({ paired: true, ready: false });
        props.match.params.sampleId = unreadySample.id;
        const scope = mockApiGetSampleDetail(unreadySample);
        renderWithMemoryRouter(<SampleDetailGeneral {...props} />);

        expect(await screen.findByText("Metadata")).toBeInTheDocument();

        expect(screen.getByText("Create Sample")).toBeInTheDocument();
        expect(screen.getByText(new RegExp(unreadySample.job.state, "i"))).toBeInTheDocument();

        expect(screen.getByText("Host")).toBeInTheDocument();
        expect(screen.getByText(unreadySample.host)).toBeInTheDocument();

        expect(screen.getByText("Isolate")).toBeInTheDocument();
        expect(screen.getByText(unreadySample.isolate)).toBeInTheDocument();

        expect(screen.getByText("Locale")).toBeInTheDocument();
        expect(screen.getByText(unreadySample.locale)).toBeInTheDocument();

        expect(screen.queryByText("Library")).not.toBeInTheDocument();
        expect(screen.queryByText("Notes")).not.toBeInTheDocument();

        scope.done();
    });

    it("should render properly", async () => {
        const scope = mockApiGetSampleDetail(sample);
        renderWithMemoryRouter(<SampleDetailGeneral {...props} />);

        expect(await screen.findByText("Metadata")).toBeInTheDocument();

        expect(screen.queryByText("Create Sample")).not.toBeInTheDocument();
        expect(screen.queryByText(new RegExp(sample.job.state, "i"))).not.toBeInTheDocument();

        expect(screen.getByText("Host")).toBeInTheDocument();
        expect(screen.getByText(sample.host)).toBeInTheDocument();

        expect(screen.getByText("Isolate")).toBeInTheDocument();
        expect(screen.getByText(sample.isolate)).toBeInTheDocument();

        expect(screen.getByText("Locale")).toBeInTheDocument();
        expect(screen.getByText(sample.locale)).toBeInTheDocument();

        expect(screen.getByText("Encoding")).toBeInTheDocument();
        expect(screen.getByText("Sanger / Illumina 1.9")).toBeInTheDocument();

        expect(screen.getByText("Read Count")).toBeInTheDocument();
        expect(screen.getByText(numbro(sample.quality.count).format("0.0 a"))).toBeInTheDocument();

        expect(screen.getByText("Library Type")).toBeInTheDocument();
        expect(screen.getByText("Normal")).toBeInTheDocument();

        expect(screen.getByText("Length Range")).toBeInTheDocument();
        expect(screen.getByText(sample.quality.length.join(" - "))).toBeInTheDocument();

        expect(screen.getByText("GC Content")).toBeInTheDocument();
        expect(screen.getByText(numbro(sample.quality.gc / 100).format("0.0 %"))).toBeInTheDocument();

        scope.done();
    });

    it("should render with [paired=true]", async () => {
        const scope = mockApiGetSampleDetail(sample);
        renderWithMemoryRouter(<SampleDetailGeneral {...props} />);

        expect(await screen.findByText("Paired")).toBeInTheDocument();
        expect(screen.getByText("Yes")).toBeInTheDocument();

        scope.done();
    });

    it("should render with [paired=false]", async () => {
        sample = createFakeSample({ paired: false });
        props.match.params.sampleId = sample.id;
        const scope = mockApiGetSampleDetail(sample);
        renderWithMemoryRouter(<SampleDetailGeneral {...props} />);

        expect(await screen.findByText("Paired")).toBeInTheDocument();
        expect(screen.getByText("No")).toBeInTheDocument();

        scope.done();
    });
});
