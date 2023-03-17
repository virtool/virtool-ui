import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { forEach } from "lodash-es";
import React from "react";
import { ThemeProvider } from "styled-components";
import { EDIT_REFERENCE, UPDATE_SETTINGS } from "../../../app/actionTypes";
import { theme } from "../../../app/theme";
import { SourceTypeItem } from "../SourceTypes/list";
import { mapDispatchToProps, SourceTypes } from "../SourceTypes/SourceTypes";

const rerenderWithProviders = (rerender, ui) => {
    return rerender(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
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

        await userEvent.type(screen.getByRole("textbox"), "test_source");
        await userEvent.click(screen.getByRole("button", { name: "Add" }));

        expect(props.onUpdate).toHaveBeenCalledWith([...props.sourceTypes, "test_source"], true, "foo");
    });

    it("should call onUpdate when trash is clicked", async () => {
        renderWithProviders(<SourceTypes {...props} />);
        await userEvent.click(screen.getAllByLabelText("trash")[0]);
        expect(props.onUpdate).toHaveBeenCalledWith([props.sourceTypes[1]], true, "foo");
    });

    it("should not add source type to list if it already exists", async () => {
        renderWithProviders(<SourceTypes {...props} />);

        await userEvent.type(screen.getByRole("textbox"), "isolate");
        await userEvent.click(screen.getByRole("button", { name: "Add" }));

        expect(screen.getAllByText("isolate").length).toBe(1);
        expect(screen.getByText("Source type already exists")).toBeInTheDocument();
    });

    it("should not add source type to list if it contains space", async () => {
        renderWithProviders(<SourceTypes {...props} />);

        await userEvent.type(screen.getByRole("textbox"), "test source");
        await userEvent.click(screen.getByRole("button", { name: "Add" }));

        expect(screen.queryByText("test source")).toBeNull();
        expect(screen.getByText("Source types may not contain spaces")).toBeInTheDocument();
    });

    it("should call onToggle() when handleEnable() is called and [restrictSourceTypes=true]", async () => {
        renderWithProviders(<SourceTypes {...props} global={false} />);

        await userEvent.click(screen.getByLabelText("Enable"));

        expect(props.onToggle).toHaveBeenCalledWith("foo", false);
    });

    it("should call onToggle() handleEnable() is called and [restrictSourceTypes=false]", async () => {
        props.restrictSourceTypes = false;
        props.global = false;

        renderWithProviders(<SourceTypes {...props} />);

        await userEvent.click(screen.getByLabelText("Enable"));

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

    it("should call onRemove() when remove icon is clicked", async () => {
        renderWithProviders(<SourceTypeItem {...props} />);
        await userEvent.click(screen.queryByLabelText("trash"));
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
