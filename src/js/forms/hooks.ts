import { getSessionStorage, setSessionStorage } from "@utils/utils";
import { forEach, isEqual } from "lodash-es";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { FieldValues, useForm, UseFormProps, UseFormReturn, useWatch } from "react-hook-form";

/**
 * Restore form values from session storage.
 *
 * @param name - the name of the form
 * @param methods - collection of methods for updating the form
 * @param setHasRestored - set the state of the form restoration
 * @param castValues - modifies the form values before restoring
 */
function restoreFormValues<TFieldValues extends FieldValues = FieldValues>(
    name: string,
    methods: UseFormReturn<TFieldValues>,
    setHasRestored: Dispatch<SetStateAction<boolean>>,
    castValues?: (value: TFieldValues) => TFieldValues,
) {
    const {
        formState: { defaultValues, isDirty },
        setValue,
    } = methods;

    const previousFormValues = getSessionStorage(`${name}FormValues`);

    if (previousFormValues && !isEqual(previousFormValues, defaultValues) && !isDirty) {
        const castFormData = castValues ? castValues(previousFormValues) : previousFormValues;
        forEach(castFormData, (value, key) => {
            setValue(key, value);
        });

        setHasRestored(true);
    }
}

type usePersistentFormProps<TFieldValues extends FieldValues> = UseFormProps<TFieldValues> & {
    /** the form name used as the key for get and setting session storage*/
    formName: string;
    /** modifies the form values before restoring */
    castValues?: (value: TFieldValues) => TFieldValues;
};

/** A custom hook for creating a form that persists data in session storage. */
export function usePersistentForm<TFieldValues extends FieldValues>({
    formName,
    castValues,
    ...props
}: usePersistentFormProps<TFieldValues>) {
    const methods = useForm<TFieldValues>(props);

    const firstRender = useRef(true);
    const [hasRestored, setHasRestored] = useState(false);

    useWatch({ control: methods.control });

    if (firstRender.current) {
        restoreFormValues(formName, methods, setHasRestored, castValues);
    } else {
        console.log("hello");
        const values = methods.getValues();
        setSessionStorage(`${formName}FormValues`, values);
    }

    firstRender.current = false;
    console.log(hasRestored);
    return { ...methods, hasRestored };
}
