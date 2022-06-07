import * as utils from "../../../utils/utils";
import { JobsList, mapStateToProps, mapDispatchToProps } from "../List";

import { createStore } from "redux";
import { screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

const createAppStore = state => () => createStore(state => state, state);
const renderWithAllProviders = (ui, store) => {
    const wrappedUI = <BrowserRouter> {ui} </BrowserRouter>;
    renderWithProviders(wrappedUI, store);
};

describe("<JobsList />", () => {
    let props;
    let state;
    beforeEach(() => {
        props = {
            documents: [
                {
                    created_at: "2022-06-02T17:21:22.668000Z",
                    id: "test_id",
                    progress: 100,
                    stage: "",
                    state: "complete",
                    user: {
                        id: "test_user_id",
                        handle: "user_handle",
                        administrator: true
                    },
                    workflow: "create_sample"
                }
            ],
            total_count: 5,
            page: 2,
            page_count: 3,
            term: "foo",
            onLoadNextPage: jest.fn(),
            canArchive: jest.fn(),
            canCancel: jest.fn()
        };

        state = {
            jobs: {
                counts: {
                    running: { jobType1: 1, jobType2: 1 },
                    complete: { jobType1: 2, jobType2: 2 }
                }
            },
            account: {
                administrator: true
            }
        };
    });

    it("should render", () => {
        renderWithAllProviders(<JobsList {...props} />, createAppStore(state));
        expect(screen.getByText("Jobs")).toBeInTheDocument();
        expect(screen.getByText("running").textContent === "running 2").toBeTruthy();
        expect(screen.getByText("Create Sample")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("User or workflow")).toBeInTheDocument();
    });

    it("componentDidMount should call onLoadNextPage", () => {
        expect(props.onLoadNextPage).not.toHaveBeenCalled();
        renderWithAllProviders(<JobsList {...props} />, createAppStore(state));
        expect(props.onLoadNextPage).toHaveBeenCalledWith("foo", 1);
    });

    it("should render when [this.props.documents=null]", () => {
        props.documents = null;
        renderWithAllProviders(<JobsList {...props} />, createAppStore(state));
        expect(screen.queryByText("Jobs")).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText("User or workflow")).not.toBeInTheDocument();
        expect(screen.getByLabelText("loading")).toBeInTheDocument();
    });

    it("should render when [this.props.documents.length=0]", () => {
        props.documents = [];
        renderWithAllProviders(<JobsList {...props} />, createAppStore(state));
        expect(screen.getByText("Jobs")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("User or workflow")).toBeInTheDocument();
        expect(screen.getByText("No jobs found.")).toBeInTheDocument();
    });
});

describe("mapStateToProps", () => {
    it("checkAdminOrPermission should return state.account.permissions[permission]", () => {
        jest.clearAllMocks();
        jest.spyOn(utils, "checkAdminOrPermission");
        const state = {
            jobs: {
                term: "foo"
            },
            account: {
                administrator: false,
                permissions: {
                    cancel_job: "fee",
                    remove_job: "bee"
                }
            }
        };

        const result = mapStateToProps(state);
        expect(utils.checkAdminOrPermission).toHaveBeenNthCalledWith(
            1,
            {
                jobs: {
                    term: "foo"
                },
                account: {
                    administrator: false,
                    permissions: {
                        cancel_job: "fee",
                        remove_job: "bee"
                    }
                }
            },
            "cancel_job"
        );
        expect(utils.checkAdminOrPermission).toHaveBeenNthCalledWith(
            2,
            {
                jobs: {
                    term: "foo"
                },
                account: {
                    administrator: false,
                    permissions: {
                        cancel_job: "fee",
                        remove_job: "bee"
                    }
                }
            },
            "remove_job"
        );

        expect(result.canCancel).toEqual("fee");
        expect(result.canArchive).toEqual("bee");
    });
});

describe("mapDispatchToProps", () => {
    it("should return onLoadNextPage in props", () => {
        const dispatch = jest.fn();
        const props = mapDispatchToProps(dispatch);

        props.onLoadNextPage("foo", "bar");
        expect(dispatch).toHaveBeenCalledWith({
            payload: { term: "foo", page: "bar", archived: false },
            type: "FIND_JOBS_REQUESTED"
        });
    });
});
