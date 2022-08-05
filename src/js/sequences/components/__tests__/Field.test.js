import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useState } from "react";
import SequenceField from "../Field";

const FieldStateManager = ({ UIElement, SequenceFieldProps }) => {
    const [fieldValue, setFieldValue] = useState("");
    const onChange = e => {
        e.preventDefault();
        setFieldValue(e.target.value);
    };
    return <UIElement {...SequenceFieldProps} onChange={onChange} value={fieldValue} />;
};

describe("<SequenceField />", () => {
    let props;

    beforeEach(() => {
        props = {
            value: "ACTG",
            readOnly: false,
            onChange: jest.fn(),
            error: ""
        };
    });

    it("should render", () => {
        renderWithProviders(<SequenceField {...props} />);
        expect(screen.getByText("Sequence")).toBeInTheDocument();
        expect(screen.getByText("Sequence").textContent === "Sequence 4").toBe(true);
        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.getByText("ACTG")).toBeInTheDocument();
    });

    it("should render with error", () => {
        props.error = "Invalid sequence";
        renderWithProviders(<SequenceField {...props} />);
        expect(screen.getByText("Invalid sequence")).toBeInTheDocument();
        expect(screen.getByRole("textbox")).toHaveStyle("border: 1px solid #E0282E");
    });

    it("should call onChange() when input changes", async () => {
        props.value = "";
        renderWithProviders(<FieldStateManager UIElement={SequenceField} SequenceFieldProps={props} />);
        await userEvent.type(screen.getByRole("textbox"), "ATAG");
        await waitFor(() => {
            expect(screen.getByRole("textbox")).toHaveValue("ATAG");
        });
    });

    it("should not accept input when [readOnly=true]", async () => {
        props.value = "";
        props.readOnly = true;
        renderWithProviders(<FieldStateManager UIElement={SequenceField} SequenceFieldProps={props} />);
        expect(screen.getByRole("textbox")).toHaveStyle("background-color: #EDF2F7");
        userEvent.type(screen.getByRole("textbox"), "ATAG");
        await waitFor(() => {
            expect(screen.getByRole("textbox")).toHaveValue("");
        });
    });
});
