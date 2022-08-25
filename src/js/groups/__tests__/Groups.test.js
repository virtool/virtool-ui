import { Groups } from "../components/Groups";
import { createStore } from "redux";
import { screen } from "@testing-library/react";

describe("Groups", () => {
    let props;
    let state;

    const createAppStore = state => {
        return () => createStore(state => state, state);
    };

    beforeEach(() => {
        props = {
            loading: false,
            groups: [
                {
                    id: "testid",
                    permissions: {
                        cancel_job: true,
                        create_ref: false,
                        create_sample: true,
                        modify_hmm: true,
                        modify_subtraction: false,
                        remove_file: true,
                        remove_job: true,
                        upload_file: true
                    }
                }
            ],
            users: [],
            onListGroups: jest.fn(),
            onFindUsers: jest.fn(),
            activeId: "testid",
            onChangeActiveGroup: jest.fn()
        };
        state = {
            groups: {
                documents: [{ id: "testid", permissions: { permission1: true, permission2: true, permission3: false } }]
            },
            users: {
                documents: {
                    handle: "testuser",
                    permissions: { permission1: true, permission2: false, permission3: true }
                }
            },
            loading: false,
            activeId: "testid"
        };
    });

    it("should render correctly when loading = true", () => {
        props.loading = true;
        renderWithProviders(<Groups {...props} />, createAppStore(state));
        expect(screen.queryByText("Manage Groups")).not.toBeInTheDocument();
        expect(screen.queryByText("No Groups Found")).not.toBeInTheDocument();
        expect(screen.queryByText("cancel_job")).not.toBeInTheDocument();
        expect(screen.queryByText("No Group Members")).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Remove Group" })).not.toBeInTheDocument();
    });

    it("should render correctly when no groups exist", () => {
        props.groups = [];
        renderWithProviders(<Groups {...props} />, createAppStore(state));
        expect(screen.getByText("No Groups Found")).toBeInTheDocument();
        expect(screen.queryByText("Groups")).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Remove Group" })).not.toBeInTheDocument();
        expect(screen.getByText("Manage Groups")).toBeInTheDocument();
        expect(screen.queryByText("Create Group")).not.toBeInTheDocument();
    });

    it("should render correctly when one groups exists and group contains no members", () => {
        renderWithProviders(<Groups {...props} />, createAppStore(state));
        expect(screen.queryByText("No groups exist")).not.toBeInTheDocument();
        expect(screen.getByText("Manage Groups")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Remove Group" })).toBeInTheDocument();
        expect(screen.getByText("cancel_job")).toBeInTheDocument();
        expect(screen.getByText("No Group Members")).toBeInTheDocument();
        expect(screen.getByText("testid")).toBeInTheDocument();
    });

    it("should render create new group view correctly", () => {
        renderWithProviders(<Groups {...props} />, createAppStore(state));
        const createButton = screen.getByRole("button", { name: "" });
        expect(screen.queryByText("Create Group")).not.toBeInTheDocument();
        createButton.click();
        expect(screen.getByText("Create Group")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        const saveButton = screen.getByRole("button", { name: "Save" });
        const input = screen.getByRole("textbox", { name: "" });
        expect(saveButton).toBeInTheDocument();
        expect(input).toBeInTheDocument();
    });

    it("should render correctly when active group has a group member", () => {
        props.users = [{ handle: "testuser1", groups: { 0: { id: "testid" } } }];
        renderWithProviders(<Groups {...props} />, createAppStore(state));
        expect(screen.getByText("testuser1")).toBeInTheDocument();
        expect(screen.queryByText("No Members Found")).not.toBeInTheDocument();
    });

    it("should render correctly when more than one group exists", () => {
        props.users = [{ handle: "testuser1", groups: { 0: { id: "testid" } } }];
        (props.groups = [
            {
                id: "testid",
                permissions: {
                    cancel_job: true,
                    create_ref: false,
                    create_sample: true,
                    modify_hmm: true,
                    modify_subtraction: false,
                    remove_file: true,
                    remove_job: true,
                    upload_file: true
                }
            },
            {
                id: "secondtestid",
                permissions: {
                    cancel_job: false,
                    create_ref: false,
                    create_sample: true,
                    modify_hmm: true,
                    modify_subtraction: false,
                    remove_file: false,
                    remove_job: true,
                    upload_file: false
                }
            }
        ]),
            renderWithProviders(<Groups {...props} />, createAppStore(state));
        expect(screen.getByText("testid")).toBeInTheDocument();
        expect(screen.getByText("secondtestid")).toBeInTheDocument();
        expect(screen.getByText("testuser1")).toBeInTheDocument();
    });
});
