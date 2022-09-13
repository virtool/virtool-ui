import { forEach } from "lodash-es";
import React from "react";
import { ThemeProvider } from "styled-components";
import { EDIT_REFERENCE, UPDATE_SETTINGS } from "../../../app/actionTypes";
import { theme } from "../../../app/theme";
import { mapDispatchToProps, SourceTypes } from "../SourceTypes/SourceTypes";
import { SourceTypeItem } from "../SourceTypes/list";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";

const rerenderWithProviders = (rerender, ui) => {
    const wrappedUi = <ThemeProvider theme={theme}>{ui}</ThemeProvider>;
    return rerender(wrappedUi);
};

describe("<SourceTypes />", () => {
    let props;

    beforeEach(() => {
        props = {
            global: true,
            refId: "foo",
            remote: false,
            restrictSourceTypes: true,
            sourceTypes: ["isolate", "serotype"],
            onUpdate: vi.fn(),
            onToggle: vi.fn()
        };
    });

    it("should render when global", () => {
        renderWithProviders(<SourceTypes {...props} />);
        expect(screen.getByText("Default Source Types")).toBeInTheDocument();
        forEach(props.sourceTypes, sourceType => {
            expect(screen.getByText(sourceType)).toBeInTheDocument();
        });
        expect(screen.getAllByLabelText("trash").length).toBe(2);
        expect(screen.getByRole("textbox", { name: "Add Source Type" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    });

    it("should render when remote", () => {
        props.global = false;
        props.remote = true;
        renderWithProviders(<SourceTypes {...props} />);
        expect(screen.getByText("Source Types")).toBeInTheDocument();
        forEach(props.sourceTypes, sourceType => {
            expect(screen.getByText(sourceType)).toBeInTheDocument();
        });
        expect(screen.queryByLabelText("trash")).not.toBeInTheDocument();
        expect(screen.queryByRole("textbox", { name: "Add Source Type" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Add" })).not.toBeInTheDocument();
    });

    it("should render when neither", () => {
        props.global = false;
        props.isRemote = false;
        renderWithProviders(<SourceTypes {...props} />);
        expect(screen.getByText("Source Types")).toBeInTheDocument();
        forEach(props.sourceTypes, sourceType => {
            expect(screen.getByText(sourceType)).toBeInTheDocument();
        });
        expect(screen.getAllByLabelText("trash").length).toBe(2);
        expect(screen.getByRole("textbox", { name: "Add Source Type" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    });

    it("should call onUpdate when Add is clicked", async () => {
        renderWithProviders(<SourceTypes {...props} />);
        userEvent.type(screen.getByRole("textbox"), "test_source");
        userEvent.click(screen.getByRole("button", { name: "Add" }));
        await waitFor(() =>
            expect(props.onUpdate).toHaveBeenCalledWith([...props.sourceTypes, "test_source"], true, "foo")
        );
    });

    it("should call onUpdate when trash is clicked", async () => {
        renderWithProviders(<SourceTypes {...props} />);
        userEvent.click(screen.getAllByLabelText("trash")[0]);
        await waitFor(() => expect(props.onUpdate).toHaveBeenCalledWith([props.sourceTypes[1]], true, "foo"));
    });

    it("is should undo removal when Undo is clicked", async () => {
        const { rerender } = renderWithProviders(
            <SourceTypes {...{ ...props, sourceTypes: ["isolate", "serotype"] }} />
        );
        rerenderWithProviders(rerender, <SourceTypes {...{ ...props, sourceTypes: ["serotype"] }} />);
        userEvent.click(screen.getByLabelText("undo"));
        await waitFor(() => expect(props.onUpdate).toHaveBeenCalledWith(["serotype", "isolate"], true, "foo"));
    });

    it("should not add source type to list if it already exists", async () => {
        renderWithProviders(<SourceTypes {...props} />);
        userEvent.type(screen.getByRole("textbox"), "isolate");
        userEvent.click(screen.getByRole("button", { name: "Add" }));
        await waitFor(() => expect(screen.getAllByText("isolate").length).toBe(1));
        await waitFor(() => expect(screen.getByText("Source type already exists")).toBeInTheDocument());
    });

    it("should not add source type to list if it contains space", async () => {
        renderWithProviders(<SourceTypes {...props} />);
        userEvent.type(screen.getByRole("textbox"), "test source");
        userEvent.click(screen.getByRole("button", { name: "Add" }));
        await waitFor(() => expect(screen.queryByText("test source")).toBeNull());
        await waitFor(() => expect(screen.getByText("Source types may not contain spaces")).toBeInTheDocument());
    });

    it("should call onToggle() when handleEnable() is called and [restrictSourceTypes=true]", () => {
        props.global = false;
        renderWithProviders(<SourceTypes {...props} />);
        userEvent.click(screen.getByLabelText("Enable"));
        expect(props.onToggle).toHaveBeenCalledWith("foo", false);
    });

    it("should call onToggle() handleEnable() is called and [restrictSourceTypes=false]", () => {
        props.restrictSourceTypes = false;
        props.global = false;
        renderWithProviders(<SourceTypes {...props} />);
        userEvent.click(screen.getByLabelText("Enable"));
        expect(props.onToggle).toHaveBeenCalledWith("foo", true);
    });
});

describe("<SourceTypeItem />", () => {
    let props;

    beforeEach(() => {
        props = {
            onRemove: vi.fn(),
            sourceType: "genotype",
            disabled: false
        };
    });

    it("should render when [disabled=false]", () => {
        renderWithProviders(<SourceTypeItem {...props} />);
        expect(screen.getByText("genotype")).toBeInTheDocument();
        expect(screen.getByLabelText("trash")).toBeInTheDocument();
    });

    it("should render when [disabled=true]", () => {
        props.disabled = true;
        renderWithProviders(<SourceTypeItem {...props} />);
        expect(screen.getByText("genotype")).toBeInTheDocument();
        expect(screen.queryByLabelText("trash")).toBeNull();
    });

    it("should call onRemove() when remove icon is clicked", () => {
        renderWithProviders(<SourceTypeItem {...props} />);
        userEvent.click(screen.queryByLabelText("trash"));
        expect(props.onRemove).toHaveBeenCalledWith("genotype");
    });
});

describe("mapDispatchToProps", () => {
    let dispatch;
    let props;

    beforeEach(() => {
        dispatch = vi.fn();
        props = mapDispatchToProps(dispatch);
    });

    it("should return onUpdate() in props when global", () => {
        props.onUpdate(["genotype"], true, "foo");
        expect(dispatch).toHaveBeenCalledWith({
            type: UPDATE_SETTINGS.REQUESTED,
            payload: {
                update: {
                    default_source_types: ["genotype"]
                }
            }
        });
    });

    it("should return onUpdate() in props when not global", () => {
        props.onUpdate(["genotype"], false, "foo");
        expect(dispatch).toHaveBeenCalledWith({
            type: EDIT_REFERENCE.REQUESTED,
            payload: {
                refId: "foo",
                update: {
                    source_types: ["genotype"]
                }
            }
        });
    });

    it("should return onToggle() in props that can be called with false", () => {
        props.onToggle("foo", false);
        expect(dispatch).toHaveBeenCalledWith({
            type: EDIT_REFERENCE.REQUESTED,
            payload: {
                refId: "foo",
                update: {
                    restrict_source_types: false
                }
            }
        });
    });

    it("should return onToggle() in props that can be called with true", () => {
        props.onToggle("foo", true);
        expect(dispatch).toHaveBeenCalledWith({
            type: EDIT_REFERENCE.REQUESTED,
            payload: {
                refId: "foo",
                update: {
                    restrict_source_types: true
                }
            }
        });
    });
});
