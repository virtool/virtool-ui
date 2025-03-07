import { RelativeTime } from "@base";
import { act, screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import React from "react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const fakeTime = "2019-02-10T17:11:00.000000Z";
const RealDate = Date;

describe("<RelativeTime />", () => {
    beforeAll(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2019-04-22T10:20:30Z"));
    });

    it("should render 2 months ago", () => {
        renderWithProviders(<RelativeTime time={fakeTime} />);
        expect(screen.getByText("2 months ago")).toHaveTextContent(
            "2 months ago",
        );
    });

    it("should re-render when time prop changes", () => {
        const { rerender } = renderWithProviders(
            <RelativeTime time={fakeTime} />,
        );
        expect(screen.getByText("2 months ago")).toBeInTheDocument();

        // Add one month to the time prop.
        rerender(<RelativeTime time="2019-01-10T12:21:00.000000Z" />);

        expect(screen.queryByText("2 months ago")).toBeNull();
        expect(screen.getByText("3 months ago")).toBeInTheDocument();
    });

    it("should re-render when time string changes", () => {
        vi.useFakeTimers().setSystemTime(new Date("2019-04-22T10:20:30Z"));

        // Render with time that is only 10 seconds before the current (mocked) time.
        renderWithProviders(<RelativeTime time="2019-04-22T10:20:20Z" />);
        expect(screen.getByText("10 seconds ago")).toBeInTheDocument();

        act(() => {
            vi.setSystemTime(new Date("2019-04-22T10:20:32Z"));
            vi.advanceTimersByTime(8000);
        });

        expect(screen.getByText("20 seconds ago")).toBeInTheDocument();
    });

    afterAll(() => {
        vi.useRealTimers();
        Date = RealDate;
    });
});
