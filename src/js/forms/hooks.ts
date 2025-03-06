import { getSessionStorage, setSessionStorage } from "@/utils";
import { forEach, isEqual } from "lodash-es";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import {
    FieldValues,
    useForm,
    UseFormProps,
    UseFormReturn,
    useWatch,
} from "react-hook-form";

/**
 * Restore form values from session storage.
 *
 * @param name - the name of the form
 * @param methods - collection of methods for updating the form
 * @param setHasRestored - set the state of the form restoration
 */
function restoreFormValues<TFieldValues extends FieldValues = FieldValues>(
    name: string,
    methods: UseFormReturn<TFieldValues>,
    setHasRestored: Dispatch<SetStateAction<boolean>>,
) {
    const {
        formState: { defaultValues, isDirty },
        setValue,
    } = methods;

    const previousFormValues = getSessionStorage(
        `${name}FormValues`,
    ) as TFieldValues;

    if (
        previousFormValues &&
        !isEqual(previousFormValues, defaultValues) &&
        !isDirty
    ) {
        forEach(previousFormValues, (value, key) => {
            setValue(key, value);
        });

        setHasRestored(true);
    }
}

type usePersistentFormProps<TFieldValues extends FieldValues> =
    UseFormProps<TFieldValues> & {
        /** the form name used as the key for get and setting session storage*/
        formName: string;
    };

/** A custom hook for creating a form that persists data in session storage. */
export function usePersistentForm<TFieldValues extends FieldValues>({
    formName,
    ...props
}: usePersistentFormProps<TFieldValues>) {
    const methods = useForm<TFieldValues>(props);

    const firstRender = useRef(true);
    const [hasRestored, setHasRestored] = useState(false);

    useWatch({ control: methods.control });

    if (firstRender.current) {
        restoreFormValues(formName, methods, setHasRestored);
    } else {
        const values = methods.getValues();
        setSessionStorage(`${formName}FormValues`, values);
    }

    firstRender.current = false;
    return { ...methods, hasRestored };
}
