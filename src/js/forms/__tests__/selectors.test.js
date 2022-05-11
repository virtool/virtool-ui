import { getSingleFormValues, getAllFormState } from "../selectors";

describe("forms selectors", () => {
    const state = {
        forms: {
            formState: {
                test: {
                    name: "test_name",
                    otherData: ["Data_1", "Data_2", "Data_3"]
                },
                test_2: {
                    name: "test_name_2",
                    otherData: ["otherData_1", "otherData_2", "otherData_3"]
                }
            }
        }
    };
    it("should return correct form values when getSingleFormValues is called", () => {
        const result = getSingleFormValues(state, "test");
        expect(result).toEqual(state.forms.formState.test);
    });
    it("should return correct values when getAllFormState is called", () => {
        const result = getAllFormState(state);
        expect(result).toEqual(state.forms.formState);
    });
});
