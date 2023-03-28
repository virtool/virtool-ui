import { render as rtlRender, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form, Formik } from "formik";
import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "../../../app/theme";
import { ReferenceForm } from "../Form";

const renderWithFormik = (renderer, ui, initialValues, onSubmit, mode) => {
    const jsx = (
        <ThemeProvider theme={theme}>
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
                {({ touched, errors }) => (
                    <Form>
                        <ReferenceForm mode={mode} touched={touched} errors={errors} />
                    </Form>
                )}
            </Formik>
        </ThemeProvider>
    );

    return renderer(jsx);
};

describe("<ReferenceForm />", () => {
    let initialValues;
    let onSubmit;
    let mode;

    beforeEach(() => {
        initialValues = {
            description: "Foo reference",
            name: "Foo",
            organism: "Bar"
        };
        onSubmit = vi.fn();
        mode = "clone";
    });

    it("should render", () => {
        renderWithFormik(rtlRender, <ReferenceForm />, initialValues, onSubmit, mode);

        expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(initialValues.name);
        expect(screen.getByRole("textbox", { name: "Description" })).toHaveValue(initialValues.description);
    });

    it.each(["edit", "empty"], "should render Organism when type is %p", mode => {
        const { rerender } = renderWithFormik(rtlRender, <ReferenceForm />, initialValues, onSubmit, mode);
        expect(screen.queryByText("Organism")).not.toBeInTheDocument();

        renderWithFormik(rerender, <ReferenceForm />, initialValues, onSubmit, mode);
        expect(screen.getByText("Organism")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Organism" })).toHaveValue(initialValues.organism);
    });

    it.each(["Name", "Organism", "Description"])("should call onChange() when %p input changes", async name => {
        mode = "edit";
        const newValue = `${initialValues[name.toLowerCase()]} changed`;

        renderWithFormik(rtlRender, <ReferenceForm />, initialValues, onSubmit, mode);

        await userEvent.clear(screen.getByRole("textbox", { name }));
        await userEvent.type(screen.getByRole("textbox", { name }), newValue);

        expect(screen.getByRole("textbox", { name })).toHaveValue(newValue);
    });
});
