import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SequenceForm, validationSchema } from "../Form";
import { Formik, Form } from "formik";
import { SaveButton } from "../../../base";

const initialValues = { accession: "", definition: "", host: "", sequence: "" };

const FormikWrapper = (UI, onSubmit) => {
    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ touched, errors }) => (
                <Form>
                    <UI touched={touched} errors={errors} />
                    <SaveButton />
                </Form>
            )}
        </Formik>
    );
};

describe("<SequenceForm />", () => {
    let onSubmit;

    beforeEach(() => {
        onSubmit = vi.fn();
    });

    it("should render", () => {
        renderWithProviders(FormikWrapper(SequenceForm, onSubmit));
        expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Host" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Definition" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Sequence 0" })).toBeInTheDocument();
    });

    it("should display errors when accession, definition, or sequence not defined", async () => {
        renderWithProviders(FormikWrapper(SequenceForm, onSubmit));

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(onSubmit).not.toHaveBeenCalled();
        expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getByRole("textbox", { name: "Definition" })).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getByRole("textbox", { name: "Sequence 0" })).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getAllByText("Required Field").length).toBe(3);
    });

    it("should display specific error when sequence contains chars !== ATCG", async () => {
        renderWithProviders(FormikWrapper(SequenceForm, onSubmit));

        await userEvent.type(screen.getByRole("textbox", { name: "Sequence 0" }), "atbcq");
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getByRole("textbox", { name: "Sequence 5" })).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getByText("Sequence should only contain the characters: ATCGN")).toBeInTheDocument();
    });
});
