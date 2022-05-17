jest.mock("../../utils");
import { screen } from "@testing-library/react";
import * as functions from "../../utils";
import { JobStepDescription, JobStepIcon } from "../Step";

describe("<JobStepDescription />", () => {
    let props;
    const spyStepDescription = jest.spyOn(functions, "getStepDescription");
    beforeEach(() => {
        spyStepDescription.mockClear().mockReturnValue({ description: "foo", title: "bar" });
        props = {
            step_description: "foo",
            step_name: "bar",
            title: "test",
            timestamp: "2022-05-19T17:48:25.508000Z"
        };
    });

    it("renders correctly", () => {
        renderWithProviders(<JobStepDescription {...props} />);
        expect(screen.getByText("foo")).toBeInTheDocument();
        expect(screen.getByText("bar")).toBeInTheDocument();
    });

    it("getStepDescription is called 1 time", () => {
        renderWithProviders(<JobStepDescription {...props} />);
        expect(functions.getStepDescription).toHaveBeenCalledTimes(1);
    });

    it("getStepDescription returns correct values", () => {
        let step = props;
        let expectedVal = { description: "foo", title: "bar" };
        expect(functions.getStepDescription(step)).toEqual(expectedVal);
    });
});

describe("<JobStepIcon />", () => {
    let props;

    beforeEach(() => {
        props = {
            complete: false,
            state: "running"
        };
    });

    it("renders correct icon when step complete", () => {
        props.complete = true;
        const wrapper = shallow(<JobStepIcon {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("renders correct icon when state complete", () => {
        props.state = "complete";
        const wrapper = shallow(<JobStepIcon {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("renders correct icon when state preparing", () => {
        props.state = "preparing";
        const wrapper = shallow(<JobStepIcon {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("renders correct icon when state running", () => {
        props.state = "running";
        const wrapper = shallow(<JobStepIcon {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("renders correct icon when state cancelled", () => {
        props.state = "cancelled";
        const wrapper = shallow(<JobStepIcon {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("renders correct icon when state error", () => {
        props.state = "error";
        const wrapper = shallow(<JobStepIcon {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("renders correct icon when state waiting", () => {
        props.state = "waiting";
        const wrapper = shallow(<JobStepIcon {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});
