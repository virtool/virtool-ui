import { SettingsCheckbox } from "@administration/components/SettingsCheckbox";
import {
    BoxGroup,
    BoxGroupDisabled,
    BoxGroupHeader,
    BoxGroupSection,
    Button,
    InputError,
    InputGroup,
    InputLabel,
    InputLevel,
    InputSimple,
    LoadingPlaceholder,
    SectionHeader,
} from "@base";
import { IconButton } from "@base/IconButton";
import { cn } from "@utils/utils";
import { get } from "lodash-es";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { useUpdateSourceTypes } from "../../hooks";
import { referenceQueryKeys, useGetReference, useUpdateReference } from "../../queries";
import { SourceTypeList } from "./SourceTypeList";

const SourceTypesInputGroup = styled(InputGroup)`
    margin-bottom: 0;
`;

type MatchTypes = {
    /** The reference id */
    refId: string;
};

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
                        <BoxGroupSection className={cn("items-center", "flex", "bg-gray-50")}>
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
                                <InputLabel htmlFor="sourceType">Add Source Type </InputLabel>
                                <InputLevel>
                                    <InputSimple id="sourceType" {...register("sourceType")} />
                                    <Button color="green" type="submit">
                                        Add
                                    </Button>
                                </InputLevel>
                                <InputError>{error}</InputError>
                            </SourceTypesInputGroup>
                        </form>
                    </BoxGroupSection>
                </BoxGroupDisabled>
            </BoxGroup>
        </section>
    );
}
