import Samples from "@samples/components/Samples";
import { screen, waitFor } from "@testing-library/react";
import { createFakeSample, mockApiGetSampleDetail } from "@tests/fake/samples";
import { renderWithRouter } from "@tests/setup";
import numbro from "numbro";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";

describe("<SampleDetailGeneral />", () => {
    let sample;
    function formatSamplePath(sample) {
        return `/samples/${sample.id}/general`;
    }

    beforeEach(() => {
        sample = createFakeSample({ paired: true });
    });

    it("should render properly when data is installing", async () => {
        const unreadySample = createFakeSample({ paired: true, ready: false });
        const scope = mockApiGetSampleDetail(unreadySample);
        renderWithRouter(<Samples />, formatSamplePath(unreadySample));

        await waitFor(() => scope.done());

        expect(await screen.findByText("Metadata")).toBeInTheDocument();

        expect(screen.getByText("Create Sample")).toBeInTheDocument();
        expect(
            screen.getByText(new RegExp(unreadySample.job.state, "i")),
        ).toBeInTheDocument();

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
        renderWithRouter(<Samples />, formatSamplePath(sample));

        expect(await screen.findByText("Metadata")).toBeInTheDocument();

        expect(screen.queryByText("Create Sample")).not.toBeInTheDocument();
        expect(
            screen.queryByText(new RegExp(sample.job.state, "i")),
        ).not.toBeInTheDocument();

        expect(screen.getByText("Host")).toBeInTheDocument();
        expect(screen.getByText(sample.host)).toBeInTheDocument();

        expect(screen.getByText("Isolate")).toBeInTheDocument();
        expect(screen.getByText(sample.isolate)).toBeInTheDocument();

        expect(screen.getByText("Locale")).toBeInTheDocument();
        expect(screen.getByText(sample.locale)).toBeInTheDocument();

        expect(screen.getByText("Encoding")).toBeInTheDocument();
        expect(screen.getByText("Sanger / Illumina 1.9")).toBeInTheDocument();

        expect(screen.getByText("Read Count")).toBeInTheDocument();
        expect(
            screen.getByText(numbro(sample.quality.count).format("0.0 a")),
        ).toBeInTheDocument();

        expect(screen.getByText("Library Type")).toBeInTheDocument();
        expect(screen.getByText("Normal")).toBeInTheDocument();

        expect(screen.getByText("Length Range")).toBeInTheDocument();
        expect(
            screen.getByText(sample.quality.length.join(" - ")),
        ).toBeInTheDocument();

        expect(screen.getByText("GC Content")).toBeInTheDocument();
        expect(
            screen.getByText(numbro(sample.quality.gc / 100).format("0.0 %")),
        ).toBeInTheDocument();

        scope.done();
    });

    it("should render with [paired=true]", async () => {
        const scope = mockApiGetSampleDetail(sample);
        renderWithRouter(<Samples />, formatSamplePath(sample));

        expect(await screen.findByText("Paired")).toBeInTheDocument();
        expect(screen.getByText("Yes")).toBeInTheDocument();

        scope.done();
    });

    it("should render with [paired=false]", async () => {
        sample = createFakeSample({ paired: false });
        const scope = mockApiGetSampleDetail(sample);
        renderWithRouter(<Samples />, formatSamplePath(sample));

        expect(await screen.findByText("Paired")).toBeInTheDocument();
        expect(screen.getByText("No")).toBeInTheDocument();

        scope.done();
    });
});
