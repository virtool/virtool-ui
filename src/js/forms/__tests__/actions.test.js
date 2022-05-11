import { DELETE_PERSISTENT_FORM_STATE, SET_PERSISTENT_FORM_STATE, SET_REDUX_FORM_STATE } from "../../app/actionTypes";
import { deletePersistentFormState, setPersistentFormState, setReduxFormState } from "../actions";

describe("forms actions", () => {
    it("should return correct values when setPersistentFormState is called", () => {
        const result = setPersistentFormState("test_name", { test_val: "test_value" });
        expect(result).toEqual({
            type: SET_PERSISTENT_FORM_STATE,
            payload: { formName: "test_name", formValues: { test_val: "test_value" } }
        });
    });

    it("should return correct values when deletePersistentFormState is called", () => {
        const result = deletePersistentFormState("test_name");
        expect(result).toEqual({
            type: DELETE_PERSISTENT_FORM_STATE,
            payload: { formName: "test_name" }
        });
    });

    it("should return correct values when updateReduxFormState is called", () => {
        const result = setReduxFormState({
            test_state: { test_val: "test_value" }
        });
        expect(result).toEqual({
            type: SET_REDUX_FORM_STATE,
            payload: {
                formState: {
                    test_state: {
                        test_val: "test_value"
                    }
                }
            }
        });
    });
});
