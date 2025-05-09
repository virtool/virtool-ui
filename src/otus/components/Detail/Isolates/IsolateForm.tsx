import { formatIsolateName } from "@app/utils";
import DialogFooter from "@base/DialogFooter";
import Input from "@base/Input";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import SaveButton from "@base/SaveButton";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { SourceType } from "./SourceType";

const IsolateFormFields = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: ${(props) => props.theme.gap.column};
`;

type IsolateFormValues = {
    sourceName: string;
    sourceType: string;
};

type IsolateFormProps = {
    sourceName?: string;
    sourceType?: string;
    /** Indicates whether the source types are restricted */
    restrictSourceTypes: boolean;
    /** A callback function to be called when the form is submitted */
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
    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            sourceName: sourceName || "",
            sourceType: sourceType || (restrictSourceTypes ? "unknown" : ""),
        },
    });

    return (
        <form onSubmit={handleSubmit((values) => onSubmit({ ...values }))}>
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
                        disabled={
                            watch("sourceType").toLowerCase() === "unknown"
                        }
                    />
                </InputGroup>
            </IsolateFormFields>

            <InputGroup>
                <InputLabel htmlFor="isolateName">Isolate Name</InputLabel>
                <Input
                    id="isolateName"
                    value={formatIsolateName({
                        sourceName: watch("sourceName"),
                        sourceType: watch("sourceType"),
                    })}
                    readOnly
                />
            </InputGroup>

            <DialogFooter>
                <SaveButton />
            </DialogFooter>
        </form>
    );
}
