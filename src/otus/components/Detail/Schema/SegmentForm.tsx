import Checkbox from "@base/Checkbox";
import DialogFooter from "@base/DialogFooter";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSelect from "@base/InputSelect";
import InputSimple from "@base/InputSimple";
import SaveButton from "@base/SaveButton";
import { Molecule, OtuSegment } from "@otus/types";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";

const moleculeTypes = [
    "",
    Molecule.ss_dna,
    Molecule.ds_dna,
    Molecule.ss_rna_pos,
    Molecule.ss_rna_neg,
    Molecule.ss_rna,
    Molecule.ds_rna,
];

const SegmentFormBody = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-column-gap: ${(props) => props.theme.gap.column};
`;

type FormValues = {
    segmentName: string;
    molecule: Molecule | "";
    required: boolean;
};

type SegmentFormProps = {
    segmentName?: string;
    molecule?: Molecule;
    required?: boolean;
    /** A callback function to be called when the form is submitted */
    onSubmit: (values: FormValues) => void;
    /** The segments associated with the otu */
    schema: OtuSegment[];
};

/**
 * Form for creating a segment
 */
export default function SegmentForm({
    segmentName,
    molecule,
    required,
    onSubmit,
    schema,
}: SegmentFormProps) {
    const {
        formState: { errors },
        control,
        register,
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            segmentName: segmentName || "",
            molecule: molecule || "",
            required: required !== false,
        },
    });

    const molecules = moleculeTypes.map((molecule) => (
        <option key={molecule} value={molecule}>
            {molecule || "None"}
        </option>
    ));

    return (
        <form onSubmit={handleSubmit((values) => onSubmit({ ...values }))}>
            <SegmentFormBody>
                <InputGroup>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <InputSimple
                        id="name"
                        {...register("segmentName", {
                            required: "Name required",
                            validate: (value) =>
                                schema.find((s) => s.name === value) &&
                                "Segment names must be unique. This name is currently in use.",
                        })}
                    />
                    <InputError>{errors.segmentName?.message}</InputError>
                </InputGroup>

                <InputGroup>
                    <InputLabel htmlFor="molecule">Molecule Type</InputLabel>
                    <InputSelect id="molecule" {...register("molecule")}>
                        {molecules}
                    </InputSelect>
                </InputGroup>

                <Controller
                    name="required"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Checkbox
                            checked={value}
                            id={`SegmentCheckbox-${segmentName}`}
                            label="Segment Required"
                            onClick={() => onChange(!value)}
                        />
                    )}
                />

                <DialogFooter>
                    <SaveButton />
                </DialogFooter>
            </SegmentFormBody>
        </form>
    );
}
