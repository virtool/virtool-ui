import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SampleUserGroup } from "../SampleUserGroup";

describe("SampleUserGroup", () => {
    let props;
    beforeEach(() => {
        props = {
            groups: [{ name: "bar", id: "bar_id" }],
            onChange: vi.fn(),
            selected: "",
        };
    });

    it("should render", () => {
        renderWithProviders(<SampleUserGroup {...props} />);

        expect(screen.getByLabelText("User Group")).toBeInTheDocument();
        expect(screen.getByText("None")).toBeInTheDocument();
        expect(screen.getByText("bar")).toBeInTheDocument();
    });
    it("should call onChange input is changed", async () => {
        renderWithProviders(<SampleUserGroup {...props} />);

        await userEvent.selectOptions(screen.getByLabelText("User Group"), "bar");
        expect(props.onChange).toHaveBeenCalled();
    });
});
