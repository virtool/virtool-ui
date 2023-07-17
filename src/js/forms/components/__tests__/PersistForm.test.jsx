import { render, waitFor } from "@testing-library/react";
import { FormikContext } from "formik";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { wrapWithProviders } from "../../../../tests/setupTests";
import { SET_PERSISTENT_FORM_STATE } from "../../../app/actionTypes";
import { mapDispatchToProps, mapStateToProps, PersistForm } from "../PersistForm";

function wrapWithContext(ui, contextValues) {
    return wrapWithProviders(<FormikContext.Provider value={contextValues}> {ui} </FormikContext.Provider>);
}

describe("<PersistForm />", () => {
    let props;
    let contextValues;
    beforeEach(() => {
        props = {
            formName: "test",
            formValues: { name: "test_name", otherData: ["otherData_1", "otherData_2", "otherData_3"] },
            onSetPersistentFormState: vi.fn(),
        };
        contextValues = {
            values: {},
            setValues: vi.fn(),
        };
    });

    it("should set correct value in form on first render", async () => {
        render(wrapWithContext(<PersistForm {...props} />, contextValues));
        await waitFor(() =>
            expect(contextValues.setValues).toHaveBeenCalledWith({
                name: "test_name",
                otherData: ["otherData_1", "otherData_2", "otherData_3"],
            }),
        );
    });

    it("should modify values returned based on castValues prop", async () => {
        props.castValues = values => {
            return { name: "cast_name", otherData: values.otherData.slice(0, 2) };
        };
        render(wrapWithContext(<PersistForm {...props} />, contextValues));
        await waitFor(() =>
            expect(contextValues.setValues).toHaveBeenCalledWith({
                name: "cast_name",
                otherData: ["otherData_1", "otherData_2"],
            }),
        );
    });

    it("should write FormikContext values to storage on second render", async () => {
        const { rerender } = render(wrapWithContext(<PersistForm {...props} />, contextValues));
        contextValues.values = { name: "test_name", otherData: ["otherData_1", "otherData_2", "otherData_3"] };
        rerender(wrapWithContext(<PersistForm {...props} />, contextValues));
        await waitFor(() =>
            expect(props.onSetPersistentFormState).toHaveBeenCalledWith("test", {
                name: "test_name",
                otherData: ["otherData_1", "otherData_2", "otherData_3"],
            }),
        );
    });
});

describe("mapStateToProps", () => {
    const state = {
        forms: {
            formState: {
                test: {
                    name: "test_name",
                    otherData: ["otherData_1", "otherData_2", "otherData_3"],
                },
            },
        },
    };
    const ownProps = { formName: "test" };

    it("Should return correct form values", () => {
        expect(mapStateToProps(state, ownProps)).toEqual({
            formValues: {
                name: "test_name",
                otherData: ["otherData_1", "otherData_2", "otherData_3"],
            },
        });
    });
});

describe("mapDispatchToProps", () => {
    const dispatch = vi.fn();
    it("Should return correct form values", () => {
        const { onSetPersistentFormState } = mapDispatchToProps(dispatch);
        onSetPersistentFormState("test", { test_val: "test_value" });
        expect(dispatch).toHaveBeenCalledWith({
            type: SET_PERSISTENT_FORM_STATE,
            payload: { formName: "test", formValues: { test_val: "test_value" } },
        });
    });
});
