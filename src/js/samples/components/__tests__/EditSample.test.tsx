import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeSample, mockApiEditSample } from "../../../../tests/fake/samples";
import { renderWithProviders } from "../../../../tests/setupTests";
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
        renderWithProviders(<EditSample {...props} />);

        expect(screen.queryByRole("textbox", { name: "Name" })).toBeNull();
        expect(screen.queryByRole("textbox", { name: "Isolate" })).toBeNull();
        expect(screen.queryByRole("textbox", { name: "Host" })).toBeNull();
        expect(screen.queryByRole("textbox", { name: "Locale" })).toBeNull();
        expect(screen.queryByRole("textbox", { name: "Notes" })).toBeNull();
        expect(screen.queryByText("Save")).toBeNull();
    });

    it("should render after name is changed", async () => {
        renderWithProviders(<EditSample {...props} />);

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveValue(sample.name);

        await userEvent.clear(nameInput);
        expect(nameInput).toHaveValue("");

        await userEvent.type(nameInput, "test");
        expect(nameInput).toHaveValue("test");
    });

    it("should render after isolate is changed", async () => {
        renderWithProviders(<EditSample {...props} />);

        const isolateInput = screen.getByLabelText("Isolate");
        expect(isolateInput).toBeInTheDocument();
        expect(isolateInput).toHaveValue(sample.isolate);

        await userEvent.clear(isolateInput);
        expect(isolateInput).toHaveValue("");

        await userEvent.type(isolateInput, "test");
        expect(isolateInput).toHaveValue("test");
    });

    it("should render after host is changed", async () => {
        renderWithProviders(<EditSample {...props} />);

        const hostInput = screen.getByLabelText("Host");
        expect(hostInput).toBeInTheDocument();
        expect(hostInput).toHaveValue(sample.host);

        await userEvent.clear(hostInput);
        expect(hostInput).toHaveValue("");

        await userEvent.type(hostInput, "test");
        expect(hostInput).toHaveValue("test");
    });

    it("should render after locale is changed", async () => {
        renderWithProviders(<EditSample {...props} />);

        const localeInput = screen.getByLabelText("Locale");
        expect(localeInput).toBeInTheDocument();
        expect(localeInput).toHaveValue(sample.locale);

        await userEvent.clear(localeInput);
        expect(localeInput).toHaveValue("");

        await userEvent.type(localeInput, "test");
        expect(localeInput).toHaveValue("test");
    });

    it("should render after notes is changed", async () => {
        renderWithProviders(<EditSample {...props} />);

        const notesInput = screen.getByLabelText("Notes");
        expect(notesInput).toBeInTheDocument();
        expect(notesInput).toHaveValue(sample.notes);

        await userEvent.clear(notesInput);
        expect(notesInput).toHaveValue("");

        await userEvent.type(notesInput, "test");
        expect(notesInput).toHaveValue("test");
    });

    it("should update sample when form is submitted", async () => {
        const scope = mockApiEditSample(sample, "newName", "newIsolate", "newHost", "newLocale", "newNotes");
        renderWithProviders(<EditSample {...props} />);

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
