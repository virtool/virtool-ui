import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { shallow } from "enzyme";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import { createFakeFile, mockApiUnpaginatedListFiles } from "../../../../tests/fake/files";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../../tests/setupTests";
import { FileType } from "../../../files/types";
import { CreateSubtraction } from "../Create";
import { SubtractionFileItem } from "../FileSelector";
function routerRenderWithProviders(ui, store) {
    const routerUi = <BrowserRouter> {ui} </BrowserRouter>;
    return renderWithProviders(routerUi, store);
}

function createAppStore(state) {
    return () => {
        const mockReducer = state => {
            return state;
        };
        return createStore(mockReducer, state);
    };
}

describe("<SubtractionFileItem />", () => {
    it.each([true, false])("should render when [active=%p]", active => {
        const props = {
            active,
            name: "test",
            uploaded_at: "2018-02-14T17:12:00.000000Z",
            user: { id: "test-user", handle: "test-user" },
        };
        const wrapper = shallow(<SubtractionFileItem {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

describe("<CreateSubtraction />", () => {
    let props;
    let state;

    beforeEach(() => {
        window.sessionStorage.clear();
        props = {
            show: true,
            files: [{ id: "test" }],
            error: "",
            onCreate: vi.fn(),
            onListFiles: vi.fn(),
            onHide: vi.fn(),
            onClearError: vi.fn(),
        };
        state = {
            forms: { formState: {} },
        };
    });

    it("should render when no files available", async () => {
        mockApiUnpaginatedListFiles([], true);
        routerRenderWithProviders(<CreateSubtraction {...props} />, createAppStore(state));
        expect(await screen.findByText(/no files found/i)).toBeInTheDocument();
    });

    it("should render error when submitted with no name or file entered", async () => {
        const file = createFakeFile({ name: "subtraction.fq.gz", type: FileType.subtraction });
        mockApiUnpaginatedListFiles([file], true);

        routerRenderWithProviders(
            <BrowserRouter>
                <CreateSubtraction {...props} />
            </BrowserRouter>,
            createAppStore(state),
        );
        expect(await screen.findByText(file.name)).toBeInTheDocument();
        await userEvent.click(await screen.findByText(/save/i));

        expect(screen.getByText("A name is required")).toBeInTheDocument();
        expect(screen.getByText("Please select a file")).toBeInTheDocument();
    });

    it("should submit correct values when all fields selected", async () => {
        const file = createFakeFile({ name: "testsubtraction1", type: FileType.subtraction });
        mockApiUnpaginatedListFiles([file], true);

        routerRenderWithProviders(
            <BrowserRouter>
                <CreateSubtraction {...props} />
            </BrowserRouter>,
            createAppStore(state),
        );

        const name = "testSubtractionname";
        const nickname = "testSubtractionNickname";

        await userEvent.type(await screen.findByRole("textbox", { name: "name" }), name);
        await userEvent.type(screen.getByRole("textbox", { name: "nickname" }), nickname);
        await userEvent.click(screen.getByText(/testsubtraction1/i));
        await userEvent.click(screen.getByText(/save/i));

        expect(props.onCreate).toHaveBeenCalledWith({ uploadId: file.id, name, nickname });
    });

    it("should restore form with correct values", async () => {
        const file = createFakeFile({ name: "testsubtractionname", type: FileType.subtraction });
        mockApiUnpaginatedListFiles([file], true);

        const name = "testSubtractionname";
        const nickname = "testSubtractionNickname";

        state.forms.formState["create-subtraction"] = { name, nickname };

        routerRenderWithProviders(
            <BrowserRouter>
                <CreateSubtraction {...props} />
            </BrowserRouter>,
            createAppStore(state),
        );

        expect(await screen.findByRole("textbox", { name: "name" })).toHaveValue(name);
        expect(screen.getByRole("textbox", { name: "nickname" })).toHaveValue(nickname);
    });
});
