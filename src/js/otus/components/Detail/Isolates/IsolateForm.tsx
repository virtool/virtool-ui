import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Input, InputGroup, InputLabel, InputSimple, ModalFooter, SaveButton } from "../../../../base";
import { formatIsolateName } from "../../../../utils/utils";
import { SourceType } from "../SourceType";

const IsolateFormFields = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: ${props => props.theme.gap.column};
`;

type IsolateFormValues = {
    sourceName: string;
    sourceType: string;
};

type IsolateFormProps = {
    sourceName?: string;
    sourceType?: string;
    restrictSourceTypes: boolean;
    onSubmit: (values: IsolateFormValues) => void;
    allowedSourceTypes: string[];
};

/**
 * Form for creating an OTU isolate
 */
export default function IsolateForm({
    sourceName,
    sourceType,
    restrictSourceTypes,
    onSubmit,
    allowedSourceTypes,
}: IsolateFormProps) {
    const {
        formState: { errors },
        register,
        handleSubmit,
        watch,
    } = useForm({
        defaultValues: {
            sourceName: sourceName || "",
            sourceType: sourceType || (restrictSourceTypes ? "unknown" : ""),
        },
    });

    return (
        <form onSubmit={handleSubmit(values => onSubmit({ ...values }))}>
            <IsolateFormFields>
                <SourceType
                    restrictSourceTypes={restrictSourceTypes}
                    allowedSourceTypes={allowedSourceTypes}
                    register={register}
                    watch={watch}
                />

                <InputGroup>
                    <InputLabel htmlFor="sourceName">Source Name</InputLabel>
                    <InputSimple
                        id="sourceName"
                        {...register("sourceName")}
                        disabled={watch("sourceType") === "unknown"}
                    />
                </InputGroup>
            </IsolateFormFields>

            <InputGroup>
                <InputLabel>Isolate Name</InputLabel>
                <Input
                    value={formatIsolateName({ sourceName: watch("sourceName"), sourceType: watch("sourceType") })}
                    readOnly
                />
            </InputGroup>

            <ModalFooter>
                <SaveButton />
            </ModalFooter>
        </form>
    );
}
