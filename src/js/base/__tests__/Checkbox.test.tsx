import { Checkbox } from "@base/Checkbox";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import React, { useState } from "react";
import { describe, expect, it } from "vitest";

function CheckboxEnvironment() {
    const [checked, setChecked] = useState(false);

    return (
        <Checkbox
            checked={checked}
            id="example-cb"
            label="Example"
            onClick={() => setChecked(!checked)}
        />
    );
}

describe("Checkbox", () => {
    it("should be checked and unchecked by clicks", async () => {
        renderWithProviders(<CheckboxEnvironment />);

        const checkbox = screen.getByRole("checkbox", { name: "Example" });
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();

        await userEvent.click(checkbox);

        expect(checkbox).toBeChecked();
    });
});
