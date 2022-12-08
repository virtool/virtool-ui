import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import { CreateSubtraction } from "../Create";
import { SubtractionFileItem } from "../FileSelector";

const routerRenderWithProviders = (ui, store) => {
    const routerUi = <BrowserRouter> {ui} </BrowserRouter>;
    return renderWithProviders(routerUi, store);
};

const createAppStore = state => {
    return () => {
        const mockReducer = state => {
            return state;
        };
        return createStore(mockReducer, state);
    };
};

describe("<SubtractionFileItem />", () => {
    it.each([true, false])("should render when [active=%p]", active => {
        const props = {
            active,
            name: "test",
            uploaded_at: "2018-02-14T17:12:00.000000Z",
            user: { id: "test-user", handle: "test-user" }
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
            onClearError: vi.fn()
        };
        state = {
            files: {
                documents: [
                    {
                        count: 0,
                        description: "",
                        id: 2,
                        name: "testSubtraction1",
                        type: "subtraction",
                        user: "testUser",
                        uploaded_at: "2021-10-14T20:57:36.558000Z"
                    },
                    {
                        count: 0,
                        description: "",
                        id: 3,
                        name: "testSubtraction2",
                        type: "subtraction",
                        user: "testUser",
                        uploaded_at: "2021-10-14T20:57:36.558000Z"
                    }
                ]
            },
            forms: { formState: {} }
        };
    });

    it("should render when no files available", () => {
        state.files.documents = [];
        routerRenderWithProviders(<CreateSubtraction {...props} />, createAppStore(state));
        expect(screen.getByText(/no files found/i)).toBeInTheDocument();
    });

    it("should render error when submitted with no name or file entered", async () => {
        routerRenderWithProviders(
            <BrowserRouter>
                <CreateSubtraction {...props} />
            </BrowserRouter>,
            createAppStore(state)
        );

        await userEvent.click(screen.getByText(/save/i));

        expect(screen.getByText("A name is required")).toBeInTheDocument();
        expect(screen.getByText("Please select a file")).toBeInTheDocument();
    });

    it("should submit correct values when all fields selected", async () => {
        routerRenderWithProviders(
            <BrowserRouter>
                <CreateSubtraction {...props} />
            </BrowserRouter>,
            createAppStore(state)
        );

        const name = "testSubtractionname";
        const nickname = "testSubtractionNickname";

        await userEvent.type(screen.getByRole("textbox", { name: "name" }), name);
        await userEvent.type(screen.getByRole("textbox", { name: "nickname" }), nickname);
        await userEvent.click(screen.getByText(/testsubtraction1/i));
        await userEvent.click(screen.getByText(/save/i));

        const uploadId = state.files.documents[0].id;

        expect(props.onCreate).toHaveBeenCalledWith({ uploadId, name, nickname });
    });

    it("should restore form with correct values", () => {
        const name = "testSubtractionname";
        const nickname = "testSubtractionNickname";

        state.forms.formState["create-subtraction"] = { name, nickname };

        routerRenderWithProviders(
            <BrowserRouter>
                <CreateSubtraction {...props} />
            </BrowserRouter>,
            createAppStore(state)
        );

        expect(screen.getByRole("textbox", { name: "name" })).toHaveValue(name);
        expect(screen.getByRole("textbox", { name: "nickname" })).toHaveValue(nickname);
    });

    it("should call onListFiles() when modal enters", () => {
        props.show = false;
        const wrapper = shallow(<CreateSubtraction {...props} />);
        expect(props.onListFiles).not.toHaveBeenCalled();

        wrapper.setProps({ show: true });

        setTimeout(() => expect(props.onListFiles).toHaveBeenCalledWith(), 500);
    });
});
