import { getSessionStorage, setSessionStorage } from "@app/utils";
import { isEqual } from "es-toolkit/predicate";
import { useEffect, useRef, useState } from "react";
import {
    FieldValues,
    Path,
    useForm,
    UseFormProps,
    UseFormReturn,
    useWatch,
} from "react-hook-form";

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
    const [hasRestored, setHasRestored] = useState(false);
    const initialized = useRef(false);

    const values = useWatch({ control: methods.control });

    useEffect(() => {
        restoreFormValues(formName, methods, setHasRestored);
        initialized.current = true;
    }, []);

    useEffect(() => {
        if (initialized.current) {
            setSessionStorage(`${formName}FormValues`, methods.getValues());
        }
    }, [values, formName]);

    return { ...methods, hasRestored };
}

function restoreFormValues<TFieldValues extends FieldValues = FieldValues>(
    name: string,
    methods: UseFormReturn<TFieldValues>,
    setHasRestored: (value: boolean) => void,
) {
    const {
        formState: { defaultValues, isDirty },
        setValue,
    } = methods;

    const previousFormValues = getSessionStorage(
        `${name}FormValues`,
    ) as Partial<TFieldValues>;

    if (
        previousFormValues &&
        !isEqual(previousFormValues, defaultValues) &&
        !isDirty
    ) {
        Object.entries(previousFormValues).forEach(([key, value]) => {
            setValue(key as Path<TFieldValues>, value);
        });

        setHasRestored(true);
    }
}
