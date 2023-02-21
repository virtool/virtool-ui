import { ProgressBar } from "../ProgressBar";
import { ProgressBarAffixed } from "../ProgressBarAffixed";

describe("<ProgressBar />", () => {
    const props = {
        now: 32
    };

    it("should render", () => {
        const wrapper = shallow(<ProgressBar {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it.each(["green", "blue", "red", "orange"])("should render when [color=%p]", color => {
        props.color = color;
        const wrapper = shallow(<ProgressBar {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

describe("<AffixedProgressBar />", () => {
    const props = {
        now: 68
    };

    it("should render", () => {
        const wrapper = shallow(<ProgressBarAffixed {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when [bottom=true]", () => {
        const wrapper = shallow(<ProgressBarAffixed {...props} bottom />);
        expect(wrapper).toMatchSnapshot();
    });

    it.each(["green", "blue", "red", "orange"])("should render when [color=%p]", color => {
        props.color = color;
        const wrapper = shallow(<ProgressBarAffixed {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});
