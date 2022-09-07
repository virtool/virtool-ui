import { CLEAR_API_KEY, CREATE_API_KEY, PUSH_STATE } from "../../../../app/actionTypes";
import * as utils from "../../../../utils/utils";
import { CreateAPIKey, getInitialFormValues, mapDispatchToProps, mapStateToProps } from "../Create";
import { createStore } from "redux";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

const createAppStore = state => {
    return () => createStore(state => state, state);
};

describe("getInitialFormValues()", () => {
    it("should return correct initial state", () => {
        expect(getInitialFormValues({ foo: false, bar: true })).toEqual({
            name: "",
            permissions: { foo: false, bar: false }
        });
    });
});

describe("<CreateAPIKey />", () => {
    let props;
    let state;

    beforeEach(() => {
        props = {
            newKey: null,
            permissions: { foo: false, bar: true },
            onCreate: vi.fn(),
            onHide: vi.fn(),
            show: true
        };
        state = {
            account: {
                permissions: {
                    permission1: false,
                    permission2: false
                }
            }
        };
    });

    it("should render correctly when newKey is empty", () => {
        renderWithProviders(<CreateAPIKey {...props} />, createAppStore(state));
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Permissions")).toBeInTheDocument();
        expect(screen.getByText("foo")).toBeInTheDocument();
        expect(screen.getByText("bar")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("should render correctly when newKey is set", () => {
        props.newKey = "123abc";
        renderWithProviders(<CreateAPIKey {...props} />, createAppStore(state));
        expect(screen.getByText("Here is your key.")).toBeInTheDocument();
        expect(screen.getByDisplayValue("123abc")).toBeInTheDocument();
        expect(screen.queryByText("Copied")).not.toBeInTheDocument();
        screen.getByRole("button", { name: "copy" }).click();
        expect(screen.getByText("Copied")).toBeInTheDocument();
    });

    it("should fail to submit and show errors when no name provided", async () => {
        renderWithProviders(<CreateAPIKey {...props} />, createAppStore(state));
        expect(screen.queryByText("Provide a name for the key")).not.toBeInTheDocument();
        screen.getByRole("button", { name: "Save" }).click();

        await waitFor(() => {
            expect(props.onCreate).not.toHaveBeenCalled();
            expect(screen.getByText("Provide a name for the key")).toBeInTheDocument();
        });
    });

    it("should allow submission when name provided", async () => {
        const testRender = renderWithProviders(<CreateAPIKey {...props} />, createAppStore(state));
        const input = testRender.getByRole("textbox", { name: "Name" });
        expect(screen.queryByText("Provide a name for the key")).not.toBeInTheDocument();
        fireEvent.change(input, { target: { value: "testname" } });
        screen.getByRole("button", { name: "Save" }).click();

        await waitFor(() => {
            expect(props.onCreate).toHaveBeenCalled();
            expect(screen.queryByText("Provide a name for the key")).not.toBeInTheDocument();
        });
    });
});

describe("mapStateToProps", () => {
    let spy;

    it.each([true, false])("should return props when routerLocationHasState() returns %p", show => {
        spy = vi.spyOn(utils, "routerLocationHasState").mockImplementation(() => show);

        const newKey = "123abc";
        const permissions = { foo: true };

        const state = {
            account: {
                newKey,
                permissions
            }
        };

        expect(mapStateToProps(state)).toEqual({
            newKey,
            permissions,
            show
        });

        expect(utils.routerLocationHasState).toHaveBeenCalledWith(state, "createAPIKey");

        spy.mockReset();
    });

    afterAll(() => {
        spy.mockRestore();
    });
});

describe("mapDispatchToProps()", () => {
    let dispatch;
    let props;

    beforeEach(() => {
        dispatch = vi.fn();
        props = mapDispatchToProps(dispatch);
    });

    it("should return functional props.onCreate", () => {
        const name = "foo";
        const permissions = { bar: true };

        props.onCreate(name, permissions);

        expect(dispatch).toHaveBeenCalledWith({
            type: CREATE_API_KEY.REQUESTED,
            payload: { name, permissions }
        });
    });

    it("should return functional props.onHide", () => {
        props.onHide();
        expect(dispatch).toHaveBeenCalledWith({
            type: PUSH_STATE,
            payload: {
                state: {
                    createAPIKey: false
                }
            }
        });
        expect(dispatch).toHaveBeenCalledWith({
            type: CLEAR_API_KEY
        });
    });
});
