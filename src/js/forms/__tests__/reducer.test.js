import { SET_REDUX_FORM_STATE } from "../../app/actionTypes";
import { setSessionStorage } from "../../utils/utils";
import { formsReducer } from "../reducer";

describe("formsReducers", () => {
    let formState;
    let state;
    beforeEach(() => {
        formState = {
            test: {
                name: "test_name",
                otherData: ["otherData_1", "otherData_2", "otherData_3"]
            }
        };
        state = { formState };
        setSessionStorage("formState", formState);
    });

    it("should getInitial data from session storage", () => {
        const result = formsReducer(undefined, {});
        expect(result).toEqual({ formState });
    });

    it("should return correct state when action type UPDATE_FORM_STATE passed", () => {
        const modFormState = {
            test: {
                name: "mod_test_name",
                otherData: ["mod_otherData_1", "mod_otherData_2"]
            }
        };
        const result = formsReducer(state, {
            type: SET_REDUX_FORM_STATE,
            payload: { formState: modFormState }
        });
        expect(result).toEqual({ formState: modFormState });
    });
});
