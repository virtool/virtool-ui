import { PublicClientApplication } from "@azure/msal-browser";
import { getMsalConfig } from "../../../app/authConfig";
import { Bar, mapStateToProps, mapDispatchToProps } from "../NavBar";
import crypto from "crypto";

describe("<Bar />", () => {
    const props = {
        administrator: true,
        id: "foo",
        pending: false,
        onLogout: vi.fn()
    };
    it("should render", () => {
        const wrapper = shallow(<Bar {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

describe("mapStateToProps", () => {
    const state = {
        account: { foo: "bar" },
        app: {
            pending: false
        }
    };
    it("should return props", () => {
        const result = mapStateToProps(state);
        expect(result).toEqual({
            foo: "bar",
            pending: false
        });
    });
});

describe("mapDispatchToProps", () => {
    const dispatch = vi.fn();

    global.crypto = crypto;
    window.b2c = {
        clientId: "null"
    };
    window.msalInstance = new PublicClientApplication(getMsalConfig());

    it("should return onLogout in props", () => {
        const props = mapDispatchToProps(dispatch);
        props.onLogout();
        expect(dispatch).toHaveBeenCalled();
    });
});
