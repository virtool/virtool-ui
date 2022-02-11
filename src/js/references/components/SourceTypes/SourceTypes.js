import { Field, Form, Formik } from "formik";
import { difference, get, includes, reject, toLower } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import * as Yup from "yup";
import { updateSetting } from "../../../administration/actions";
import { getColor } from "../../../app/theme";
import {
    BoxGroup,
    BoxGroupHeader,
    BoxGroupSection,
    Button,
    Checkbox,
    Icon,
    Input,
    InputContainer,
    InputError
} from "../../../base";
import { editReference } from "../../actions";
import { SourceTypeList } from "./list";
import { usePrevious } from "../../../base/hooks";

const SourceTypesTitle = styled.h2`
    display: flex;
    justify-content: space-between;
`;

const globalDescription = `
    Configure a list of default source types. New references will automatically take these values as their allowed
    source types.
`;

const localDescription = `
    Configure a list of allowable source types. When a user creates a new isolate they will only be able to select a
    source type from this list. If this feature is disabled, users will be able to enter any string as a source
    type.
`;

const SourceTypesCheckbox = styled(Checkbox)`
    margin-left: auto;
    text-align: right;
`;

const SourceTypeBoxGroupSection = styled(BoxGroupSection)`
    label {
        display: block;
        margin-bottom: 3px;
        color: ${props => getColor({ theme: props.theme, color: props.disabled ? "grey" : "greyDark" })};
    }
    ${InputContainer} {
        display: flex;
        margin-bottom: 5px;
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

const SourceTypeInput = styled.span`
    display: flex;
    flex: 1 0 auto;
    margin-right: 10px;
    flex-direction: column;
`;

const UndoSection = styled(BoxGroupSection)`
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

const validationSchema = sourceTypes =>
    Yup.object().shape({
        sourceInput: Yup.string()
            .trim()
            .notOneOf(sourceTypes, "Source type already exists")
            .test("containsNoSpaces", "Source types may not contain spaces", value => !includes(value, " "))
    });

export const SourceTypes = ({ sourceTypes, refId, restrictSourceTypes, onToggle, global, remote, onUpdate }) => {
    const previousSourceTypes = usePrevious(sourceTypes);
    const [removedSourceType] = difference(previousSourceTypes, sourceTypes);

    const handleEnable = () => {
        if (refId) {
            onToggle(refId, !restrictSourceTypes);
        }
    };

    const onRemoveSourceType = sourceTypeName => {
        const newSourceTypes = reject(sourceTypes, sourceType => sourceType === sourceTypeName);
        onUpdate(newSourceTypes, global, refId);
    };

    const handleAdd = ({ sourceInput }, { resetForm }) => {
        const newSourceType = toLower(sourceInput.trim());
        if (!newSourceType) return;

        onUpdate([...sourceTypes, newSourceType], global, refId);
        resetForm();
    };

    const handleUndo = () => {
        if (!removedSourceType) return;
        onUpdate([...sourceTypes, removedSourceType], global, refId);
    };

    const disabled = !global && (remote || !restrictSourceTypes);

    let checkbox;

    if (!global && !remote) {
        checkbox = <SourceTypesCheckbox label="Enable" checked={restrictSourceTypes} onClick={handleEnable} />;
    }

    const title = `${global ? "Default" : ""} Source Types`;
    return (
        <BoxGroup>
            <BoxGroupHeader>
                <SourceTypesTitle>
                    <span>{title}</span>
                    {checkbox}
                </SourceTypesTitle>
                <p>{global ? globalDescription : localDescription}</p>
            </BoxGroupHeader>
            <SourceTypeList sourceTypes={sourceTypes} disabled={disabled} onRemove={onRemoveSourceType} />

            {disabled || !removedSourceType || (
                <UndoSection>
                    <span>
                        The source type <strong>{removedSourceType}</strong> was just removed.
                    </span>
                    <Icon name={"undo"} onClick={handleUndo} aria-label="undo" />
                </UndoSection>
            )}

            {remote || (
                <SourceTypeBoxGroupSection disabled={disabled}>
                    <Formik
                        onSubmit={handleAdd}
                        initialValues={{ sourceInput: "" }}
                        validationSchema={validationSchema(sourceTypes)}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <label htmlFor="sourceInput">Add Source Type </label>
                                <InputContainer>
                                    <SourceTypeInput>
                                        <Field
                                            name="sourceInput"
                                            id="sourceInput"
                                            as={Input}
                                            disabled={disabled}
                                            type="text"
                                        />
                                        <InputError>{touched.sourceInput && errors.sourceInput}</InputError>
                                    </SourceTypeInput>
                                    <Button color="green" type="submit" disabled={disabled}>
                                        Add
                                    </Button>
                                </InputContainer>
                            </Form>
                        )}
                    </Formik>
                </SourceTypeBoxGroupSection>
            )}
        </BoxGroup>
    );
};

const mapStateToProps = (state, { global = false }) => {
    const sourceTypes = global
        ? state.settings.data.default_source_types
        : get(state, "references.detail.source_types", []);

    const restrictSourceTypes = global
        ? state.settings.restrict_source_types
        : get(state, "references.detail.restrict_source_types", false);

    let refId;
    let remote = false;

    if (!global) {
        refId = get(state, "references.detail.id");
        remote = get(state, "references.detail.remotes_from");
    }
    return {
        global,
        restrictSourceTypes,
        refId,
        sourceTypes,
        remote
    };
};

export const mapDispatchToProps = dispatch => ({
    onUpdate: (value, global, refId) => {
        if (global) {
            dispatch(updateSetting("default_source_types", value));
        } else {
            dispatch(editReference(refId, { source_types: value }));
        }
    },

    onToggle: (refId, value) => {
        dispatch(editReference(refId, { restrict_source_types: value }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SourceTypes);
