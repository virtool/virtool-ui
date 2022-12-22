import { APIKeys } from "../API";
import { createBrowserHistory } from "history";
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { attachResizeObserver } from "../../../../../tests/setupTests";

const createReducer = (state, history) =>
    combineReducers({
        account: createGenericReducer(state.account),
        router: connectRouter(history)
    });

describe("<API />", () => {
    let props;
    let state;
    let history;

    beforeEach(() => {
        attachResizeObserver();
        props = {
            keys: [
                {
                    id: "1234",
                    name: "testName1",
                    created_at: "2022-12-22T21:37:49.429000Z",
                    permissions: { Permission1: true, Permission2: true, Permission3: false }
                }
            ],
            onGet: vi.fn()
        };
        state = {
            account: {
                permissions: {
                    permission1: true,
                    permission2: true,
                    permission3: false
                },
                newKey: null,
                administrator: false
            }
        };

        history = createBrowserHistory();
        history.location.state = {
            createAPIKey: false
        };
    });

    it("should render correctly when keys === null", () => {
        props.keys = null;

        renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

        expect(screen.getByLabelText("loading")).toBeInTheDocument();
        expect(screen.queryByText("Manage API keys for accessing the")).not.toBeInTheDocument();
    });

    it("should render correctly when apiKey exists", () => {
        renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

        expect(screen.getByText("Manage API keys for accessing the")).toBeInTheDocument();
        expect(screen.getByText("Virtool API")).toBeInTheDocument();
        expect(screen.getByText("Create")).toBeInTheDocument();

        expect(screen.getByText("testName1")).toBeInTheDocument();
    });

    it("should render correctly when no apiKeys exist", () => {
        props.keys = [];

        renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

        expect(screen.getByText("Manage API keys for accessing the")).toBeInTheDocument();
        expect(screen.getByText("Virtool API")).toBeInTheDocument();
        expect(screen.getByText("No API keys found.")).toBeInTheDocument();

        expect(screen.queryByText("testName1")).not.toBeInTheDocument();
    });

    describe("<CreateAPIKey", () => {
        beforeEach(() => {
            history.location.state = {
                createAPIKey: true
            };
        });
        it("should render correctly when newKey = empty", async () => {
            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            await userEvent.click(screen.getByText("Create"));

            expect(screen.getByText("Create API Key")).toBeInTheDocument();

            expect(screen.getByText("Name")).toBeInTheDocument();
            expect(screen.getByText("Permissions")).toBeInTheDocument();
            expect(screen.getByText("permission1")).toBeInTheDocument();
            expect(screen.getByText("permission2")).toBeInTheDocument();

            expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
        });

        it("should render correctly when newKey is set", async () => {
            state.account.newKey = "123abc";

            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            expect(screen.getByText("Here is your key.")).toBeInTheDocument();
            expect(screen.getByText(/Make note of it now. For security purposes/)).toBeInTheDocument();

            expect(screen.getByDisplayValue("123abc")).toBeInTheDocument();
            expect(screen.queryByText("Copied")).not.toBeInTheDocument();

            await userEvent.click(screen.getByRole("button", { name: "copy" }));

            expect(screen.getByText("Copied")).toBeInTheDocument();
        });

        it("should fail to submit and display errors when no name provided", async () => {
            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            await userEvent.click(screen.getByText("Create"));

            expect(screen.queryByText("Provide a name for the key")).not.toBeInTheDocument();

            await userEvent.click(screen.getByRole("button", { name: "Save" }));

            expect(screen.getByText("Provide a name for the key")).toBeInTheDocument();
        });

        describe("APIKeyAdiminstratorInfo", () => {
            it("should render correctly when newKey is empty and state.administrator = true", () => {
                state.account.administrator = true;

                renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

                expect(screen.getByText(/You are an administrator/)).toBeInTheDocument();
                expect(screen.getByText(/If you lose your administrator role, this API/)).toBeInTheDocument();
            });

            it("should render correctly when newKey is empty and state.administrator = false", () => {
                renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

                expect(screen.queryByText(/You are an administrator/)).not.toBeInTheDocument();
                expect(screen.queryByText(/If you lose your administrator role, this API/)).not.toBeInTheDocument();
            });
        });
    });

    describe("APIKey", () => {
        it("should render correctly when collapsed", () => {
            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            expect(screen.getByText("testName1")).toBeInTheDocument();
            expect(screen.getByText(/Created/)).toBeInTheDocument();
            expect(screen.getByText("2 permissions")).toBeInTheDocument();
        });

        it("should render correctly when expanded", async () => {
            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            await userEvent.click(screen.getByText("testName1"));

            expect(screen.getByText("testName1")).toBeInTheDocument();
            expect(screen.getByText(/Created/)).toBeInTheDocument();
            expect(screen.getByText("2 permissions")).toBeInTheDocument();

            expect(screen.getByText("Permission1")).toBeInTheDocument();
            expect(screen.getByText("Permission3")).toBeInTheDocument();

            expect(screen.getByText("Remove")).toBeInTheDocument();
            expect(screen.getByText("Update")).toBeInTheDocument();
        });

        it("should collapse view when close button clicked", async () => {
            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            await userEvent.click(screen.getByText("testName1"));

            expect(screen.getByText("Permission1")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();

            await userEvent.click(screen.getByRole("button", { name: "close" }));

            expect(screen.queryByText("Permission1")).not.toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Remove" })).not.toBeInTheDocument();
        });
    });

    describe("APIPermissions", () => {
        it("should render permissions correctly and check and uncheck permissions when clicked, administrator = true", async () => {
            state.account.administrator = true;

            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            await userEvent.click(screen.getByText("testName1"));

            expect(screen.getByText("Permission1")).toBeInTheDocument();
            expect(screen.getByText("Permission2")).toBeInTheDocument();

            const permission1 = screen.getAllByRole("checkbox", { name: "checkbox" })[0];
            const permission3 = screen.getAllByRole("checkbox", { name: "checkbox" })[2];

            expect(permission1).toBeChecked();
            expect(permission3).not.toBeChecked();

            await userEvent.click(permission1);
            await userEvent.click(permission3);

            expect(permission1).not.toBeChecked();
            expect(permission3).toBeChecked();
        });

        it("should not check and uncheck permissions when administrator = false", async () => {
            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            await userEvent.click(screen.getByText("testName1"));

            const permission1 = screen.getAllByRole("checkbox", { name: "checkbox" })[0];
            const permission3 = screen.getAllByRole("checkbox", { name: "checkbox" })[2];

            expect(permission1).toBeChecked();
            expect(permission3).not.toBeChecked();

            await userEvent.click(permission1);
            await userEvent.click(permission3);

            expect(permission1).toBeChecked();
            expect(permission3).not.toBeChecked();
        });
    });
});
