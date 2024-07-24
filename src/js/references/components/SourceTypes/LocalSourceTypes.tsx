import { get } from "lodash-es";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { SettingsCheckbox } from "../../../administration/components/SettingsCheckbox";
import { getColor } from "../../../app/theme";
import {
    BoxGroup,
    BoxGroupDisabled,
    BoxGroupHeader,
    BoxGroupSection,
    Button,
    Icon,
    InputContainer,
    InputError,
    InputSimple,
    LoadingPlaceholder,
    SectionHeader,
} from "../../../base";
import { useUpdateSourceTypes } from "../../hooks";
import { referenceQueryKeys, useGetReference, useUpdateReference } from "../../queries";
import { SourceTypeList } from "./SourceTypeList";

const SourceTypeBoxGroupSection = styled(BoxGroupSection)`
    button {
        width: 60px;
        height: 34px;
        margin-left: auto;
        text-align: center;
        justify-content: center;
        margin-right: 5px;
    }

    label {
        display: block;
        margin-bottom: 3px;
    }

    ${InputContainer} {
        display: flex;
        margin-bottom: 5px;
    }
`;

const SourceTypeInput = styled.span`
    display: flex;
    flex: 1 0 auto;
    margin-right: 10px;
    flex-direction: column;
`;

const SourceTypesUndo = styled(BoxGroupSection)`
    display: flex;
    background: ${props => getColor({ color: "greyHover", theme: props.theme })};
    align-items: center;
    i.fas {
        margin-left: auto;
    }
    span > strong {
        text-transform: capitalize;
    }
`;

interface MatchTypes {
    /** The reference id */
    refId: string;
}

export function LocalSourceTypes() {
    const match = useRouteMatch<MatchTypes>();
    const refId = match.params.refId;

    const { data, isLoading } = useGetReference(refId);

    const { mutation: updateReferenceMutation } = useUpdateReference(refId);

    const sourceTypes = get(data, "source_types", []);
    const restrictSourceTypes = get(data, "restrict_source_types", false);

    const { error, lastRemoved, handleRemove, handleSubmit, handleUndo, register } = useUpdateSourceTypes(
        "source_types",
        `/refs/${refId}`,
        referenceQueryKeys.detail(refId),
        sourceTypes
    );

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    function handleToggle() {
        updateReferenceMutation.mutate({ restrict_source_types: !restrictSourceTypes });
    }

    return (
        <section>
            <SectionHeader>
                <h2>Source Types</h2>
                <p>Configure a list of allowable source types.</p>
            </SectionHeader>
            <SettingsCheckbox enabled={restrictSourceTypes} onToggle={handleToggle}>
                <h2>Restrict Source Types</h2>
                <small>
                    Only allow users to to select from allowed source types for isolates. If disabled, users will be
                    able to enter any string as a source type.
                </small>
            </SettingsCheckbox>
            <BoxGroup>
                <BoxGroupHeader>
                    <h2>Manage Source Types</h2>
                    <p>Add or remove source types for this reference.</p>
                </BoxGroupHeader>

                <BoxGroupDisabled disabled={!restrictSourceTypes}>
                    <SourceTypeList sourceTypes={sourceTypes} onRemove={handleRemove} />
                    {lastRemoved && (
                        <SourceTypesUndo>
                            <span>
                                The source type <strong>{lastRemoved}</strong> was just removed.
                            </span>
                            <Icon name={"undo"} onClick={handleUndo} aria-label="undo" />
                        </SourceTypesUndo>
                    )}
                    <SourceTypeBoxGroupSection>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="sourceType">Add Source Type </label>
                            <InputContainer>
                                <SourceTypeInput>
                                    <InputSimple id="sourceType" {...register("sourceType")} />
                                    <InputError>{error}</InputError>
                                </SourceTypeInput>
                                <Button color="green" type="submit">
                                    Add
                                </Button>
                            </InputContainer>
                        </form>
                    </SourceTypeBoxGroupSection>
                </BoxGroupDisabled>
            </BoxGroup>
        </section>
    );
}
