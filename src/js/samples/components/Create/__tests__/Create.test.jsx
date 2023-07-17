import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { shallow } from "enzyme";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../../../tests/setupTests";
import { LIST_LABELS } from "../../../../app/actionTypes";
import { CreateSample, mapDispatchToProps, mapStateToProps } from "../Create";
function createAppStore(state) {
    return () => createStore(state => state, state);
}
function routerRenderWithProviders(ui, store) {
    const routerUi = <BrowserRouter> {ui} </BrowserRouter>;
    return renderWithProviders(routerUi, store);
}

describe("<CreateSample>", () => {
    const readFileName = "large";
    let props;
    let values;
    let state;

    beforeEach(() => {
        window.sessionStorage.clear();

        props = {
            error: "",
            readyReads: Array(3)
                .fill(0)
                .map((_, id) => ({
                    id,
                    name: `${readFileName} ${id}`,
                    name_on_disk: `${id}-${readFileName}.fq.gz`,
                    size: 0,
                })),
            allLabels: [
                { color: "#3B82F6", count: 0, description: "", id: 2, name: "testlabel1" },
                { color: "#3C8786", count: 0, description: "", id: 3, name: "testlabel2" },
            ],
            subtractions: [
                { name: "Foo Subtraction", id: "foo_subtraction", ready: true },
                { name: "Bar Subtraction", id: "bar_subtraction", ready: true },
            ],
            forceGroupChoice: false,
            onCreate: vi.fn(),
            onLoadSubtractionsAndFiles: vi.fn(),
            onListLabels: vi.fn(),
        };

        values = {
            name: "Sample 1",
            selected: ["abc123-Foo.fq.gz", "789xyz-Bar.fq.gz"],
            host: "Host",
            isolate: "Isolate",
            locale: "Timbuktu",
            subtractionId: "sub_bar",
            libraryType: "sRNA",
        };

        state = {
            labels: {
                documents: [
                    { color: "#3B82F6", count: 0, description: "", id: 2, name: "testlabel1" },
                    { color: "#3C8786", count: 0, description: "", id: 3, name: "testlabel2" },
                ],
            },
            subtraction: {
                shortlist: [
                    { name: "Foo Subtraction", id: "foo_subtraction", ready: true },
                    { name: "Bar Subtraction", id: "bar_subtraction", ready: true },
                ],
            },
            forms: { formState: {} },
        };
    });

    const submitForm = () => userEvent.click(screen.getByRole("button", { name: /Create/i }));

    async function inputFormRequirements(props, sampleName = "Name") {
        await userEvent.type(screen.getByLabelText("Name"), sampleName);
        await userEvent.click(screen.getByText(props.readyReads[0].name));
        await userEvent.click(screen.getByText(props.readyReads[1].name));
    }

    it("should render", () => {
        const wrapper = shallow(<CreateSample {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render LoadingPlaceholder when [props.subtractions=null]", () => {
        props.subtractions = null;
        const wrapper = shallow(<CreateSample {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render LoadingPlaceholder when [props.readyReads=null]", () => {
        props.readyReads = null;
        const wrapper = shallow(<CreateSample {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should fail to submit and show errors on empty submission", async () => {
        routerRenderWithProviders(<CreateSample {...props} />, createAppStore(state));

        expect(screen.queryByText("Required Field")).not.toBeInTheDocument();
        expect(screen.queryByText("At least one read file must be attached to the sample")).not.toBeInTheDocument();

        await submitForm();

        expect(props.onCreate).toHaveBeenCalledTimes(0);
        expect(screen.getByText("Required Field")).toBeInTheDocument();
        expect(screen.getByText("At least one read file must be attached to the sample")).toBeInTheDocument();
    });

    it("should submit when required fields are completed", async () => {
        routerRenderWithProviders(<CreateSample {...props} />, createAppStore(state));

        await inputFormRequirements(props, values.name);
        await submitForm();

        expect(props.onCreate).toHaveBeenCalledWith(values.name, "", "", "", "normal", [], [0, 1], []);
    });

    it("should submit expected results when form is fully completed", async () => {
        routerRenderWithProviders(<CreateSample {...props} />, createAppStore(state));
        const { name, isolate, host, locale, libraryType } = values;

        await inputFormRequirements(props, name);

        // Fill out the rest of the form and submit
        await userEvent.type(screen.getByLabelText("Isolate"), isolate);
        await userEvent.type(screen.getByLabelText("Host"), host);
        await userEvent.type(screen.getByLabelText("Locale"), locale);
        await userEvent.click(screen.getByRole("button", { name: "select default subtractions" }));
        await userEvent.click(screen.getByText(state.subtraction.shortlist[0].name));
        await userEvent.click(screen.getByText(libraryType));

        await submitForm();

        expect(props.onCreate).toHaveBeenCalledWith(
            name,
            isolate,
            host,
            locale,
            libraryType.toLowerCase(),
            [state.subtraction.shortlist[0].id],
            [0, 1],
            [],
        );
    });

    it("should include labels when submitting a completed form", async () => {
        routerRenderWithProviders(<CreateSample {...props} />, createAppStore(state));
        const { name, isolate, host, locale, libraryType } = values;

        await inputFormRequirements(props, name);

        // Fill out the rest of the form and submit
        await userEvent.type(screen.getByLabelText("Isolate"), isolate);
        await userEvent.type(screen.getByLabelText("Host"), host);
        await userEvent.type(screen.getByLabelText("Locale"), locale);
        await userEvent.click(screen.getByText(libraryType));
        await userEvent.click(screen.getByRole("button", { name: "select default subtractions" }));
        await userEvent.click(screen.getByText(state.subtraction.shortlist[0].name));
        await userEvent.click(screen.getByRole("button", { name: "select labels" }));
        await userEvent.click(screen.getByText(state.labels.documents[0].name));

        await submitForm();

        expect(props.onCreate).toHaveBeenCalledWith(
            name,
            isolate,
            host,
            locale,
            libraryType.toLowerCase(),
            [state.subtraction.shortlist[0].id],
            [0, 1],
            [state.labels.documents[0].id],
        );
    });

    it("should load form state from redux on first render", () => {
        const { name, isolate, host, locale } = values;
        state.forms.formState["create-sample"] = {
            ...values,
            sidebar: { labels: [state.labels.documents[0].id], subtractionIds: [state.subtraction.shortlist[0].id] },
        };

        routerRenderWithProviders(<CreateSample {...props} />, createAppStore(state));

        expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(name);
        expect(screen.getByLabelText("Isolate")).toHaveValue(isolate);
        expect(screen.getByLabelText("Host")).toHaveValue(host);
        expect(screen.getByLabelText("Locale")).toHaveValue(locale);
        expect(screen.getByText(state.subtraction.shortlist[0].name)).toBeInTheDocument();
        expect(screen.getByText(state.labels.documents[0].name)).toBeInTheDocument();
    });

    it("should update the sample name when the magic icon is pressed", async () => {
        routerRenderWithProviders(<CreateSample {...props} />, createAppStore(state));

        const field = screen.getByRole("textbox", { name: /Name/i });

        expect(field).toHaveValue("");

        await userEvent.click(screen.getByText(props.readyReads[0].name));
        await userEvent.click(screen.getByRole("button", { name: "Auto Fill" }));
        expect(field).toHaveValue(readFileName);
    });
});

describe("mapStateToProps()", () => {
    it("should return props", () => {
        const subtractions = [
            {
                id: "foo_subtraction",
                name: "Foo Subtraction",
            },
            {
                id: "bar_subtraction",
                name: "Bar Subtraction",
            },
        ];

        const state = {
            router: { location: { stae: "foo" } },
            settings: {
                data: {
                    sample_group: "force_choice",
                },
            },
            account: { groups: "foo" },
            samples: {
                readFiles: [
                    {
                        foo: "bar",
                        reserved: true,
                    },
                    {
                        Foo: "Bar",
                        reserved: false,
                    },
                ],
            },
            subtraction: {
                shortlist: [
                    {
                        id: "foo_subtraction",
                        name: "Foo Subtraction",
                    },
                    {
                        id: "bar_subtraction",
                        name: "Bar Subtraction",
                    },
                ],
            },
            labels: {
                documents: [
                    { color: "#3B82F6", count: 0, description: "", id: 2, name: "testlabel1" },
                    { color: "#3C8786", count: 0, description: "", id: 3, name: "testlabel2" },
                ],
            },
        };

        const props = mapStateToProps(state);

        expect(props).toEqual({
            error: "",
            forceGroupChoice: true,
            groups: "foo",
            readyReads: [
                {
                    Foo: "Bar",
                    reserved: false,
                },
            ],
            subtractions,
            allLabels: [
                { color: "#3B82F6", count: 0, description: "", id: 2, name: "testlabel1" },
                { color: "#3C8786", count: 0, description: "", id: 3, name: "testlabel2" },
            ],
        });
    });
});
describe("mapDispatchToProps()", () => {
    const dispatch = vi.fn();
    const props = mapDispatchToProps(dispatch);

    it("should return onLoadSubtractionsAndFiles() in props", () => {
        props.onLoadSubtractionsAndFiles();
        expect(dispatch).toHaveBeenCalledWith({ type: "FIND_READ_FILES_REQUESTED" });
        expect(dispatch).toHaveBeenCalledWith({ type: "LIST_SUBTRACTION_IDS_REQUESTED" });
    });

    it("should return createSample() in props", () => {
        props.onCreate("name", "isolate", "host", "locale", "libraryType", ["subtractions"], "files");
        expect(dispatch).toHaveBeenCalledWith({
            type: "CREATE_SAMPLE_REQUESTED",
            payload: {
                name: "name",
                isolate: "isolate",
                host: "host",
                locale: "locale",
                libraryType: "libraryType",
                subtractions: ["subtractions"],
                files: "files",
            },
        });
    });

    it("should return onClearError() in props", () => {
        props.onClearError();
        expect(dispatch).toHaveBeenCalledWith({ payload: { error: "CREATE_SAMPLE_ERROR" }, type: "CLEAR_ERROR" });
    });

    it("should return onListLabels() in props", () => {
        props.onListLabels();
        expect(dispatch).toHaveBeenCalledWith({ type: LIST_LABELS.REQUESTED });
    });
});
