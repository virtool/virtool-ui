import App from "../App";

describe("<App />", () => {
    let store;
    let wrapper;

    it("renders correctly", () => {
        store = {
            subscribe: vi.fn(),
            dispatch: vi.fn(),
            getState: vi.fn()
        };
        wrapper = shallow(<App store={store} history={{}} />);
        expect(wrapper).toMatchSnapshot();
    });
});
