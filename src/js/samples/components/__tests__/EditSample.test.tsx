import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom-v5-compat";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeSample, mockApiEditSample } from "../../../../tests/fake/samples";
import { renderWithRouter } from "../../../../tests/setupTests";
import EditSample from "../EditSample";

describe("<Editsample />", () => {
    const sample = createFakeSample();
    let props;

    beforeEach(() => {
        props = {
            sample,
            show: true,
            onHide: vi.fn(),
        };
    });

    it("should render when [show=false]", () => {
        props.show = false;

        renderWithRouter(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="samples/:id/general" element={<EditSample {...props} />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.queryByRole("textbox", { name: "Name" })).toBeNull();
        expect(screen.queryByRole("textbox", { name: "Isolate" })).toBeNull();
        expect(screen.queryByRole("textbox", { name: "Host" })).toBeNull();
        expect(screen.queryByRole("textbox", { name: "Locale" })).toBeNull();
        expect(screen.queryByRole("textbox", { name: "Notes" })).toBeNull();
        expect(screen.queryByText("Save")).toBeNull();
    });

    it.each(["Name", "Isolate", "Host", "Locale", "Notes"])("should render changed data for", async inputLabel => {
        renderWithRouter(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="samples/:id/general" element={<EditSample {...props} />} />
                </Routes>
            </MemoryRouter>
        );

        const inputBox = screen.getByLabelText(inputLabel);
        expect(inputBox).toBeInTheDocument();
        expect(inputBox).toHaveValue(sample[inputLabel.toLowerCase()]);

        await userEvent.clear(inputBox);
        expect(inputBox).toHaveValue("");

        await userEvent.type(inputBox, "test");
        expect(inputBox).toHaveValue("test");
    });

    it("should update sample when form is submitted", async () => {
        const scope = mockApiEditSample(sample, "newName", "newIsolate", "newHost", "newLocale", "newNotes");
        renderWithRouter(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="samples/:id/general" element={<EditSample {...props} />} />
                </Routes>
            </MemoryRouter>
        );

        const nameInput = screen.getByLabelText("Name");
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, "newName");

        const isolateInput = screen.getByLabelText("Isolate");
        await userEvent.clear(isolateInput);
        await userEvent.type(isolateInput, "newIsolate");

        const hostInput = screen.getByLabelText("Host");
        await userEvent.clear(hostInput);
        await userEvent.type(hostInput, "newHost");

        const localeInput = screen.getByLabelText("Locale");
        await userEvent.clear(localeInput);
        await userEvent.type(localeInput, "newLocale");

        const notesInput = screen.getByLabelText("Notes");
        await userEvent.clear(notesInput);
        await userEvent.type(notesInput, "newNotes");

        await userEvent.click(screen.getByText("Save"));
        scope.done();
    });
});
