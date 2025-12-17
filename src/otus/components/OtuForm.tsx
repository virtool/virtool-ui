import { DialogFooter } from "@base/Dialog";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import SaveButton from "@base/SaveButton";
import { useForm } from "react-hook-form";
import styled from "styled-components";

const OtuFormBody = styled.div`
    display: grid;
    grid-template-columns: 9fr 4fr;
    grid-column-gap: ${(props) => props.theme.gap.column};
`;

type FormValues = {
    name: string;
    abbreviation: string;
};

type OTUFormProps = {
    abbreviation?: string;
    /** Error message to be displayed */
    error: string;
    name?: string;
    /** A callback function to be called when the form is submitted */
    onSubmit: (values: FormValues) => void;
};

/**
 * A form component for creating an OTU
 */
export default function OtuForm({
    abbreviation,
    error,
    name,
    onSubmit,
}: OTUFormProps) {
    const {
        formState: { errors },
        register,
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: { name: name || "", abbreviation: abbreviation || "" },
    });

    return (
        <form onSubmit={handleSubmit((values) => onSubmit({ ...values }))}>
            <OtuFormBody>
                <InputGroup>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <InputSimple
                        id="name"
                        {...register("name", { required: "Name required" })}
                    />
                    <InputError>{errors.name?.message || error}</InputError>
                </InputGroup>

                <InputGroup>
                    <InputLabel htmlFor="abbreviation">Abbreviation</InputLabel>
                    <InputSimple
                        id="abbreviation"
                        {...register("abbreviation")}
                    />
                </InputGroup>
            </OtuFormBody>
            <DialogFooter>
                <SaveButton />
            </DialogFooter>
        </form>
    );
}
