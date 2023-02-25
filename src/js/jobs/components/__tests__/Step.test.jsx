import { screen } from "@testing-library/react";
import React from "react";
import { JobStep } from "../Step";

describe("<JobStep />", () => {
    let props;

    beforeEach(() => {
        props = {
            step: {
                state: "waiting",
                stage: null,
                step_name: null,
                step_description: null,
                error: null,
                timestamp: "2022-05-19T17:48:05.995000Z"
            }
        };
    });

    test("should render correctly when step_name and step_description sent from server", () => {
        const step = {
            ...props.step,
            state: "running",
            step_description: "Do something complex to the data.",
            step_name: "Reticulate Splines"
        };

        renderWithProviders(<JobStep {...props} step={step} />);

        expect(screen.getByText(step.step_description)).toBeInTheDocument();
        expect(screen.getByText(step.step_name)).toBeInTheDocument();
    });

    test.each(["timeout", "terminated", "complete", "error", "preparing", "waiting"])(
        "should render text and icon when state is special case",
        state => {
            props.step.state = state;

            const { asFragment } = renderWithProviders(<JobStep {...props} />);

            expect(screen.getByTitle(state)).toBeInTheDocument();
            expect(asFragment()).toMatchSnapshot();
        }
    );
});
