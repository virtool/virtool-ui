import { usePathParams } from "@/hooks";
import { SettingsCheckbox } from "@administration/components/SettingsCheckbox";
import { getColor } from "@app/theme";
import InputContainer from '@base/InputContainer';
import InputError from '@base/InputError';
import InputSimple from '@base/InputSimple';
import { LoadingPlaceholder, SectionHeader } from '@base';
import BoxGroup from "@base/BoxGroup";
import BoxGroupDisabled from "@base/BoxGroupDisabled";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import Button from "@base/Button";
import IconButton from "@base/IconButton";
import { get } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { useUpdateSourceTypes } from "../../hooks";
import {
    referenceQueryKeys,
    useGetReference,
    useUpdateReference,
} from "../../queries";
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
    background: ${(props) =>
        getColor({ color: "greyHover", theme: props.theme })};
    align-items: center;
    i.fas {
        margin-left: auto;
    }
    span > strong {
        text-transform: capitalize;
    }
`;

export function LocalSourceTypes() {
    const { refId } = usePathParams<{ refId: string }>();

    const { data, isPending } = useGetReference(refId);

    const { mutation: updateReferenceMutation } = useUpdateReference(refId);

    const sourceTypes = get(data, "source_types", []);
    const restrictSourceTypes = get(data, "restrict_source_types", false);

    const {
        error,
        lastRemoved,
        handleRemove,
        handleSubmit,
        handleUndo,
        register,
    } = useUpdateSourceTypes(
        "source_types",
        `/refs/${refId}`,
        referenceQueryKeys.detail(refId),
        sourceTypes,
    );

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    function handleToggle() {
        updateReferenceMutation.mutate({
            restrict_source_types: !restrictSourceTypes,
        });
    }

    return (
        <section>
            <SectionHeader>
                <h2>Source Types</h2>
                <p>Configure a list of allowable source types.</p>
            </SectionHeader>
            <SettingsCheckbox
                enabled={restrictSourceTypes}
                id="RestrictSourceTypes"
                onToggle={handleToggle}
            >
                <h2>Restrict Source Types</h2>
                <small>
                    Only allow users to to select from allowed source types for
                    isolates. If disabled, users will be able to enter any
                    string as a source type.
                </small>
            </SettingsCheckbox>
            <BoxGroup>
                <BoxGroupHeader>
                    <h2>Manage Source Types</h2>
                    <p>Add or remove source types for this reference.</p>
                </BoxGroupHeader>

                <BoxGroupDisabled disabled={!restrictSourceTypes}>
                    <SourceTypeList
                        sourceTypes={sourceTypes}
                        onRemove={handleRemove}
                    />
                    {lastRemoved && (
                        <SourceTypesUndo>
                            <span>
                                The source type <strong>{lastRemoved}</strong>{" "}
                                was just removed.
                            </span>
                            <IconButton
                                name="undo"
                                tip="undo"
                                onClick={handleUndo}
                            />
                        </SourceTypesUndo>
                    )}
                    <SourceTypeBoxGroupSection>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="sourceType">Add Source Type </label>
                            <InputContainer>
                                <SourceTypeInput>
                                    <InputSimple
                                        id="sourceType"
                                        {...register("sourceType")}
                                    />
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
