import { settingsQueryKeys } from "@administration/queries";
import {
    BoxGroup,
    BoxGroupHeader,
    BoxGroupSection,
    Button,
    InputError,
    InputGroup,
    InputLabel,
    InputLevel,
    InputSimple,
    SectionHeader,
} from "@base";
import { IconButton } from "@base/IconButton";
import { cn } from "@utils/utils";
import React from "react";
import styled from "styled-components";
import { useUpdateSourceTypes } from "../../hooks";
import { SourceTypeList } from "./SourceTypeList";

const SourceTypesInputGroup = styled(InputGroup)`
    margin-bottom: 0;
`;

type GlobalSourceTypesProps = {
    sourceTypes: string[];
};

export function GlobalSourceTypes({ sourceTypes }: GlobalSourceTypesProps) {
    const { error, lastRemoved, handleRemove, handleSubmit, handleUndo, register } = useUpdateSourceTypes(
        "default_source_types",
        "/settings",
        settingsQueryKeys.all(),
        sourceTypes
    );

    return (
        <section>
            <SectionHeader>
                <h2>Default Source Types</h2>
                <p>Configure a list of allowable source types that will be set automatically for new references.</p>
            </SectionHeader>
            <BoxGroup>
                <BoxGroupHeader>
                    <h2>Source Types</h2>
                    <p>Add or remove default source types.</p>
                </BoxGroupHeader>

                <SourceTypeList sourceTypes={sourceTypes} onRemove={handleRemove} />

                {lastRemoved && (
                    <BoxGroupSection className={cn("items-center", "flex", "bg-gray-50", "justify-between")}>
                        <span>
                            The source type <strong className={cn("capitalize")}>{lastRemoved}</strong> was just
                            removed.
                        </span>
                        <IconButton className={cn("ml-auto")} name="undo" tip="undo" onClick={handleUndo} />
                    </BoxGroupSection>
                )}

                <BoxGroupSection>
                    <form onSubmit={handleSubmit}>
                        <SourceTypesInputGroup>
                            <InputLabel htmlFor="SourceType">Add Source Type</InputLabel>
                            <InputLevel>
                                <InputSimple id="SourceType" {...register("sourceType")} />
                                <Button color="green" type="submit">
                                    Add
                                </Button>
                            </InputLevel>
                            <InputError>{error}</InputError>
                        </SourceTypesInputGroup>
                    </form>
                </BoxGroupSection>
            </BoxGroup>
        </section>
    );
}
