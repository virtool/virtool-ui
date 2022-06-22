jest.mock("../../selectors");

import { mapDispatchToProps, mapStateToProps, UserDetail } from "../Detail";

describe("<UserDetail />", () => {
    let props;

    beforeEach(() => {
        props = {
            canModifyUser: true,
            match: {
                params: {
                    userId: "foo"
                }
            },
            error: [],
            detail: {
                id: "bob",
                handle: "bob",
                administrator: true
            },
            onGetUser: jest.fn(),
            onRemoveUser: jest.fn(),
            onListGroups: jest.fn()
        };
    });

    it("should render", () => {
        const wrapper = shallow(<UserDetail {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when [administrator=false]", () => {
        props.detail.administrator = false;
        const wrapper = shallow(<UserDetail {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when [canModifyUser=false]", () => {
        props.canModifyUser = false;
        const wrapper = shallow(<UserDetail {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should call onGetUser() and onListGroups() on mount", () => {
        expect(props.onGetUser).not.toHaveBeenCalled();
        expect(props.onListGroups).not.toHaveBeenCalled();

        shallow(<UserDetail {...props} />);

        expect(props.onGetUser).toHaveBeenCalledWith("foo");
        expect(props.onListGroups).toHaveBeenCalled();
    });
});

describe("mapStateToProps", () => {
    const state = {
        users: {
            detail: { handle: "foo", last_password_change: 0 }
        },
        groups: {
            list: "foo",
            fetched: true
        }
    };

    it("should return correct props", () => {
        const props = mapStateToProps(state);

        expect(props).toEqual({
            detail: state.users.detail,
            error: "",
            lastPasswordChange: 0
        });
    });
});

describe("mapDispatchToProps", () => {
    let dispatch;
    let result;

    beforeEach(() => {
        dispatch = jest.fn();
        result = mapDispatchToProps(dispatch);
    });

    it("should return onGetUser() in props", () => {
        const userId = "foo";
        result.onGetUser(userId);
        expect(dispatch).toHaveBeenCalledWith({
            type: "GET_USER_REQUESTED",
            payload: { userId }
        });
    });

    it("should return onListGroups() in props", () => {
        result.onListGroups();
        expect(dispatch).toHaveBeenCalledWith({
            type: "LIST_GROUPS_REQUESTED"
        });
    });
});
