import { settingsQueryKeys } from "@administration/queries";
import {
    BoxGroup,
    BoxGroupHeader,
    BoxGroupSection,
    Button,
    InputError,
    InputLabel,
    InputSimple,
    SectionHeader,
} from "@/base";
import { IconButton } from "@base/IconButton";
import Toolbar from "@base/Toolbar";
import React from "react";
import { useUpdateSourceTypes } from "../../hooks";
import { SourceTypeList } from "./SourceTypeList";

type GlobalSourceTypesProps = {
    sourceTypes: string[];
};

export function GlobalSourceTypes({ sourceTypes }: GlobalSourceTypesProps) {
    const {
        error,
        lastRemoved,
        handleRemove,
        handleSubmit,
        handleUndo,
        register,
    } = useUpdateSourceTypes(
        "default_source_types",
        "/settings",
        settingsQueryKeys.all(),
        sourceTypes,
    );

    return (
        <section>
            <SectionHeader>
                <h2>Default Source Types</h2>
                <p>
                    Configure a list of allowable source types that will be set
                    automatically for new references.
                </p>
            </SectionHeader>
            <BoxGroup>
                <BoxGroupHeader>
                    <h2>Source Types</h2>
                    <p>Add or remove default source types.</p>
                </BoxGroupHeader>

                <SourceTypeList
                    sourceTypes={sourceTypes}
                    onRemove={handleRemove}
                />

                {lastRemoved && (
                    <BoxGroupSection className="bg-stone-100! flex! items-center justify-between!">
                        <span>
                            The source type{" "}
                            <strong className="capitalize">
                                {lastRemoved}
                            </strong>{" "}
                            was just removed.
                        </span>
                        <IconButton
                            name="undo"
                            tip="undo"
                            onClick={handleUndo}
                        />
                    </BoxGroupSection>
                )}

                <BoxGroupSection>
                    <form onSubmit={handleSubmit}>
                        <InputLabel htmlFor="SourceType">
                            Add Source Type
                        </InputLabel>
                        <Toolbar>
                            <div className="flex-grow">
                                <InputSimple
                                    id="SourceType"
                                    {...register("sourceType")}
                                />
                            </div>
                            <Button color="green" type="submit">
                                Add
                            </Button>
                        </Toolbar>
                        <InputError>{error}</InputError>
                    </form>
                </BoxGroupSection>
            </BoxGroup>
        </section>
    );
}
