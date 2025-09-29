import InputContainer from "@base/InputContainer";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputIconButton from "@base/InputIconButton";
import InputLabel from "@base/InputLabel";
import InputLoading from "@base/InputLoading";
import InputSimple from "@base/InputSimple";
import { getGenbank } from "@otus/api";
import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

type FormValues = {
    accession: string;
    definition: string;
    host: string;
    sequence: string;
};

/**
 * Displays the accession field of a form for a sequence
 */
export default function Accession() {
    const [pending, setPending] = useState(false);
    const [sent, setSent] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const {
        formState: { errors },
        getValues,
        register,
        setValue,
    } = useFormContext<FormValues>();

    const accession = getValues("accession");

    const onAutofill = useCallback(
        (values: FormValues) => {
            setValue("accession", values.accession);
            setValue("definition", values.definition);
            setValue("host", values.host);
            setValue("sequence", values.sequence);
        },
        [setValue],
    );

    useEffect(() => {
        if (pending && !sent) {
            setSent(true);

            getGenbank(accession).then(
                (resp) => {
                    const { accession, definition, host, sequence } = resp;

                    onAutofill({
                        accession,
                        definition,
                        host,
                        sequence,
                    });

                    setPending(false);
                    setSent(false);
                    setNotFound(false);
                },
                (err) => {
                    setPending(false);
                    setSent(true);
                    setNotFound(err.status === 404);

                    return err;
                },
            );
        }
    }, [accession, notFound, onAutofill, pending, sent]);

    return (
        <InputGroup>
            <InputLabel htmlFor="accession">Accession (ID)</InputLabel>
            <InputContainer align="right">
                <InputSimple
                    id="accession"
                    {...register("accession", {
                        required: "Required Field",
                        onChange: () => setNotFound(false),
                    })}
                />
                {pending ? (
                    <InputLoading />
                ) : (
                    <InputIconButton
                        name="magic"
                        tip="Auto Fill"
                        onClick={() => setPending(true)}
                    />
                )}
            </InputContainer>
            <InputError>
                {notFound ? "Accession not found" : errors.accession?.message}
            </InputError>
        </InputGroup>
    );
}
