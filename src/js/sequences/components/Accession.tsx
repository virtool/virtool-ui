import { InputContainer, InputError, InputGroup, InputIcon, InputLabel, InputLoading, InputSimple } from "@base";
import { getGenbank } from "@otus/api";
import { forEach } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

/**
 * Displays the accession field of a form for a sequence
 */
export function Accession() {
    const [pending, setPending] = useState(false);
    const [sent, setSent] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const {
        formState: { errors },
        getValues,
        register,
        setValue,
    } = useFormContext<{ accession: string }>();

    const accession = getValues("accession");

    function onAutofill(sequenceValues) {
        forEach(sequenceValues, (value, key) => {
            setValue(key, value);
        });
    }

    useEffect(() => {
        if (pending && !sent) {
            setSent(true);

            getGenbank(accession).then(
                resp => {
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
                err => {
                    setPending(false);
                    setSent(true);
                    setNotFound(err.status === 404);

                    return err;
                }
            );
        }
    }, [accession, pending, notFound, onAutofill]);

    return (
        <InputGroup>
            <InputLabel htmlFor="accession">Accession (ID)</InputLabel>
            <InputContainer align="right">
                <InputSimple
                    id="accession"
                    {...register("accession", { required: "Required Field", onChange: () => setNotFound(false) })}
                />
                {pending ? <InputLoading /> : <InputIcon name="magic" onClick={() => setPending(true)} />}
            </InputContainer>
            <InputError>{notFound ? "Accession not found" : errors.accession?.message}</InputError>
        </InputGroup>
    );
}
