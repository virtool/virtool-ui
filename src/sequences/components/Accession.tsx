import InputContainer from "@base/InputContainer";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputIconButton from "@base/InputIconButton";
import InputLabel from "@base/InputLabel";
import InputLoading from "@base/InputLoading";
import InputSimple from "@base/InputSimple";
import { getGenbank } from "@otus/api";
import { useState } from "react";
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
    const [notFound, setNotFound] = useState(false);

    const {
        formState: { errors },
        getValues,
        register,
        setValue,
    } = useFormContext<FormValues>();

    function handleAutoFill() {
        setPending(true);

        getGenbank(getValues("accession")).then(
            (resp) => {
                setValue("accession", resp.accession);
                setValue("definition", resp.definition);
                setValue("host", resp.host);
                setValue("sequence", resp.sequence);

                setPending(false);
                setNotFound(false);
            },
            (err) => {
                setPending(false);
                setNotFound(err.status === 404);

                return err;
            },
        );
    }

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
                        onClick={handleAutoFill}
                    />
                )}
            </InputContainer>
            <InputError>
                {notFound ? "Accession not found" : errors.accession?.message}
            </InputError>
        </InputGroup>
    );
}
