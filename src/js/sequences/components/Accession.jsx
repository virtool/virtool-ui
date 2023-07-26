import { Field, useFormikContext } from "formik";
import { forEach } from "lodash-es";
import React, { useEffect, useState } from "react";
import { Input, InputContainer, InputError, InputGroup, InputIcon, InputLabel, InputLoading } from "../../base";
import { getGenbank } from "../../otus/api";

export const Accession = ({ error }) => {
    const [pending, setPending] = useState(false);
    const [sent, setSent] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const {
        values: { accession },
        setFieldValue,
    } = useFormikContext();

    const onAutofill = sequenceValues => {
        forEach(sequenceValues, (value, key) => {
            setFieldValue(key, value);
        });
    };

    useEffect(() => {
        if (pending && !sent) {
            setSent(true);

            getGenbank(accession).then(
                resp => {
                    const { accession, definition, host, sequence } = resp.body;

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
                },
            );
        }
    }, [accession, pending, notFound, onAutofill]);

    const onChange = e => {
        setNotFound(false);
        setFieldValue("accession", e.target.value);
    };

    return (
        <InputGroup>
            <InputLabel htmlFor="accession">Accession (ID)</InputLabel>
            <InputContainer align="right">
                <Field name="accession" as={Input} error={error} id="accession" onChange={onChange} />
                {pending ? <InputLoading /> : <InputIcon name="magic" onClick={() => setPending(true)} />}
            </InputContainer>
            <InputError>{notFound ? "Accession not found" : error}</InputError>
        </InputGroup>
    );
};
