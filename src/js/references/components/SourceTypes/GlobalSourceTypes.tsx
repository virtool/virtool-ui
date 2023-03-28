import React from "react";
import styled from "styled-components";
import {
    BoxGroup,
    BoxGroupHeader,
    BoxGroupSection,
    Button,
    Icon,
    InputContainer,
    InputError,
    InputGroup,
    InputLabel,
    InputLevel,
    InputSimple,
    SectionHeader
} from "../../../base";
import { useUpdateSourceTypes } from "../../hooks";
import { SourceTypeList } from "./SourceTypeList";

const SourceTypesInputGroup = styled(InputGroup)`
    margin-bottom: 0;
`;

const SourceTypeBoxGroupSection = styled(BoxGroupSection)`
    label {
        display: block;
        margin-bottom: 3px;
    }

    ${InputContainer} {
        display: flex;
        margin-bottom: 5px;
        padding-bottom: 0;
    }

    button {
        width: 60px;
        height: 34px;
        margin-left: auto;
        text-align: center;
        justify-content: center;
        margin-right: 5px;
    }
`;

const UndoSection = styled(BoxGroupSection)`
    align-items: center;
    background: ${props => props.theme.color.greyHover};
    display: flex;
    justify-content: space-between;

    strong {
        text-transform: capitalize;
    }
`;

interface GlobalSourceTypesProps {
    sourceTypes: string[];
}

export function GlobalSourceTypes({ sourceTypes }: GlobalSourceTypesProps) {
    const { error, lastRemoved, handleRemove, handleSubmit, handleUndo, register } = useUpdateSourceTypes(
        "default_source_types",
        "/api/settings",
        "settings",
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
                    <UndoSection>
                        <span>
                            The source type <strong>{lastRemoved}</strong> was just removed.
                        </span>
                        <Icon aria-label="undo" name="undo" onClick={handleUndo} />
                    </UndoSection>
                )}

                <SourceTypeBoxGroupSection>
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
                </SourceTypeBoxGroupSection>
            </BoxGroup>
        </section>
    );
}
