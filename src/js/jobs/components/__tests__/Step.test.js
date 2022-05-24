import { JobStepDescription, JobStepIcon } from "../Step";
import { screen } from "@testing-library/react";

describe("<JobStepDescription />", () => {
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

    it("should render correctly when step_name and step_description = empty string and state is special case", () => {
        renderWithProviders(<JobStepDescription {...props} />);
        expect(screen.getByText("Waiting")).toBeInTheDocument();
        expect(screen.getByText("Waiting for resources to become available.")).toBeInTheDocument();
        props.step.state = "terminated";
        renderWithProviders(<JobStepDescription {...props} />);
        expect(screen.getByText("Terminated")).toBeInTheDocument();
        expect(screen.getByText("There was a system malfunction")).toBeInTheDocument();
    });
    
    it("should render correctly when step_name and step_description sent from server", () => {
        props.step.step_name = "foo step";
        props.step.step_description = "bar description";
        renderWithProviders(<JobStepDescription {...props} />);
        expect(screen.getByText("foo step")).toBeInTheDocument();
        expect(screen.getByText("bar description")).toBeInTheDocument();
    });

    it("should render correctly when no step_name and no step_description and state is not a special case", () => {
        props.step.state = "zzz";
        renderWithProviders(<JobStepDescription {...props} />);
        const length = screen.queryAllByText("");
        expect(length).toHaveLength(8); // if title and description not empty length is 6
        expect(screen.queryByText(/"zzz"i/)).not.toBeInTheDocument();
    });

    it("should render correctly when step_description and no step_name and state is a special case", ()=>{
        props.step.step_description = "foo test";
        renderWithProviders(<JobStepDescription {...props} />);
        expect(screen.getByText("Waiting")).toBeInTheDocument();
        expect(screen.getByText("Waiting for resources to become available.")).toBeInTheDocument();
    })
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
