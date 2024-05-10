import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { UploadTime } from "../UploadTime";

describe("<UploadTime />", () => {
    it("displays remaining time and speed correctly for less than 12 hours", () => {
        render(<UploadTime remaining={3600} uploadSpeed={5000000} />); // 1 hour, 5 MB/s
        expect(screen.getByText("> 12hr remaining")).not.toBeInTheDocument();
        expect(screen.getByText("1 hour remaining")).toBeInTheDocument();
        expect(screen.getByText("5 MB/s")).toBeInTheDocument();
    });

    it("displays remaining time and speed correctly for more than 12 hours", () => {
        render(<UploadTime remaining={45000} uploadSpeed={1000000} />); // 12.5 hours, 1 MB/s
        expect(screen.getByText("> 12hr remaining")).toBeInTheDocument();
        expect(screen.getByText("1 MB/s")).toBeInTheDocument();
    });

    it('displays "0 seconds remaining" when no time is left', () => {
        render(<UploadTime remaining={0} uploadSpeed={1000000} />); // 0 seconds, 1 MB/s
        expect(screen.getByText("0 seconds remaining")).toBeInTheDocument();
        expect(screen.getByText("1 MB/s")).toBeInTheDocument();
    });
});
