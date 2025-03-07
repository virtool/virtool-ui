import { getFontWeight } from "@app/theme";
import {
    DialogFooter,
    InputError,
    InputGroup,
    InputLabel,
    InputSimple,
} from "@base";
import Box from "@base/Box";
import Button from "@base/Button";
import Color from "@base/Color";
import { SampleLabel } from "@samples/components/Label/SampleLabel";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

const LabelFormPreview = styled(Box)`
    padding: 10px;
`;

const LabelFormPreviewLabel = styled.p`
    font-weight: ${getFontWeight("thick")};
`;

type LabelFormProps = {
    color?: string;
    description?: string;
    error?: string;
    name?: string;
    onSubmit: (data: {
        color: string;
        name: string;
        description: string;
    }) => void;
};

/**
 * A form for creating or updating a label
 */
export function LabelForm({
    color = "#D1D5DB",
    description = "",
    error = "",
    name = "",
    onSubmit,
}: LabelFormProps) {
    const [newColor, setColor] = useState(color);

    const {
        formState: { errors },
        register,
        handleSubmit,
        watch,
    } = useForm({ defaultValues: { color, description, name } });

    return (
        <form
            onSubmit={handleSubmit((values) =>
                onSubmit({ ...values, color: newColor || "#D1D5DB" }),
            )}
        >
            <InputGroup>
                <InputLabel htmlFor="name">Name</InputLabel>
                <InputSimple
                    id="name"
                    aria-invalid={errors.name ? "true" : "false"}
                    {...register("name", { required: "Name is required." })}
                />
                <InputError>{errors.name?.message || error}</InputError>
            </InputGroup>
            <InputGroup>
                <InputLabel htmlFor="description">Description</InputLabel>
                <InputSimple
                    id="description"
                    aria-invalid={errors.description ? "true" : "false"}
                    {...register("description")}
                />
            </InputGroup>
            <InputGroup>
                <InputLabel htmlFor="color">Color</InputLabel>
                <Color
                    id="color"
                    value={newColor}
                    onChange={(color) => setColor(color)}
                />
            </InputGroup>
            <LabelFormPreviewLabel>Preview</LabelFormPreviewLabel>
            <LabelFormPreview>
                <SampleLabel
                    color={newColor || "#D1D5DB"}
                    name={watch("name") || "Preview"}
                />
            </LabelFormPreview>
            <DialogFooter>
                <Button color="blue" type="submit">
                    Save
                </Button>
            </DialogFooter>
        </form>
    );
}
