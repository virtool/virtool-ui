import { Field, Form, Formik } from "formik";
import { filter, find, get } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import * as Yup from "yup";
import {
    Box,
    Icon,
    Input,
    InputContainer,
    InputError,
    InputGroup,
    InputIcon,
    InputLabel,
    LoadingPlaceholder,
    SaveButton,
    ViewHeader,
    ViewHeaderTitle
} from "../../../base";
import { clearError } from "../../../errors/actions";
import { listLabels } from "../../../labels/actions";
import { shortlistSubtractions } from "../../../subtraction/actions";
import { getSubtractionShortlist } from "../../../subtraction/selectors";
import { createSample, findReadFiles } from "../../actions";
import { LibraryTypeSelector } from "./LibraryTypeSelector";
import ReadSelector from "./ReadSelector";
import { Sidebar } from "./Sidebar";
import { SampleUserGroup } from "./UserGroup";

const extensionRegex = /^[a-z0-9]+-(.*)\.f[aq](st)?[aq]?(\.gz)?$/;

/**
 * Gets a filename without extension, given the file ID and an array of all available read files.
 * Used to autofill the name for a new sample based on the selected read file(s).
 *
 * @param {Number} id - the file ID
 * @param {Array} files - all available read files
 * @returns {*|string} the filename without its extension
 */
const getFileNameFromId = (id, files) => {
    const file = find(files, file => file.id === id);
    return file ? file.name_on_disk.match(extensionRegex)[1] : "";
};

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required Field"),
    readFiles: Yup.array().min(1, "At least one read file must be attached to the sample")
});

const CreateSampleButtonArea = styled(Box)`
    align-items: center;
    background-color: #bfdbfe;
    border: none;
    display: flex;
    grid-column: 2;
    grid-row: 1;
    margin-top: 25px;
    padding: 15px;

    p {
        color: #1e40af;
        font-weight: ${props => props.theme.fontWeight.thick};
        margin: 0 0 0 auto;
        padding-left: 15px;
    }
`;

const CreateSampleFields = styled.div`
    grid-row: 2;
`;

const CreateSampleInputError = styled(InputError)`
    text-align: left;
`;

const CreateSampleInputs = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 15px;
`;

const CreateSampleForm = styled(Form)`
    display: grid;
    grid-template-columns: minmax(auto, 1150px) max(320px, 10%);
    grid-column-gap: ${props => props.theme.gap.column};
`;

const CreateSampleName = styled(InputGroup)`
    grid-column: 1;
`;

const CreateSampleSidebar = styled(Field)`
    grid-row: 2;
    grid-column: 2;
`;

export const CreateSample = props => {
    useEffect(() => {
        props.onLoadSubtractionsAndFiles();
        props.onListLabels();
    }, []);

    if (props.subtractions === null || props.readyReads === null || props.allLabels === null) {
        return <LoadingPlaceholder margin="36px" />;
    }

    const initialValues = {
        name: "",
        isolate: "",
        host: "",
        locale: "",
        libraryType: "normal",
        readFiles: [],
        group: props.forceGroupChoice ? "none" : null,
        sidebar: { labels: [], subtractionIds: [] }
    };

    const autofill = (selected, setFieldValue) => {
        const fileName = getFileNameFromId(selected[0], props.readyReads);
        if (fileName) {
            setFieldValue("name", fileName);
        }
    };

    const handleSubmit = values => {
        const { name, isolate, host, locale, libraryType, readFiles, group, sidebar } = values;
        const { subtractionIds, labels } = sidebar;
        // Only send the group if forceGroupChoice is true
        if (props.forceGroupChoice) {
            props.onCreate(
                name,
                isolate,
                host,
                locale,
                libraryType,
                subtractionIds,
                readFiles,
                labels,
                group === "none" ? "" : group
            );
        } else {
            props.onCreate(name, isolate, host, locale, libraryType, subtractionIds, readFiles, labels);
        }
    };

    return (
        <>
            <ViewHeader title="Create Sample">
                <ViewHeaderTitle>Create Sample</ViewHeaderTitle>
                <CreateSampleInputError>{props.error}</CreateSampleInputError>
            </ViewHeader>
            <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema}>
                {({ errors, setFieldValue, touched, values }) => (
                    <CreateSampleForm>
                        <CreateSampleName>
                            <InputLabel>Name</InputLabel>
                            <InputContainer align="right">
                                <Field
                                    as={Input}
                                    type="text"
                                    name="name"
                                    aria-label="Name"
                                    autocomplete={false}
                                    error={touched.name ? errors.name : null}
                                />
                                <InputIcon
                                    name="magic"
                                    data-testid="Auto Fill"
                                    onClick={e => autofill(values.readFiles, setFieldValue, e)}
                                    disabled={!values.readFiles.length}
                                />
                            </InputContainer>
                            {touched.name && <InputError>{errors.name}</InputError>}
                        </CreateSampleName>
                        <CreateSampleFields>
                            <CreateSampleInputs>
                                <Field
                                    as={SampleUserGroup}
                                    aria-label="User Group"
                                    name="group"
                                    group={values.group}
                                    groups={props.groups}
                                    onChange={e => setFieldValue("group", e.target.value)}
                                />
                                <InputGroup>
                                    <InputLabel>Locale</InputLabel>
                                    <Field as={Input} name="locale" aria-label="Locale" />
                                </InputGroup>

                                <InputGroup>
                                    <InputLabel>Isolate</InputLabel>
                                    <Field as={Input} name="isolate" aria-label="Isolate" />
                                </InputGroup>

                                <InputGroup>
                                    <InputLabel>Host</InputLabel>
                                    <Field as={Input} name="host" aria-label="Host" />
                                </InputGroup>
                            </CreateSampleInputs>

                            <Field
                                name="libraryType"
                                as={LibraryTypeSelector}
                                onSelect={library => setFieldValue("libraryType", library)}
                                libraryType={values.libraryType}
                            />

                            <Field
                                name="readFiles"
                                as={ReadSelector}
                                files={props.readyReads}
                                selected={values.readFiles}
                                onSelect={selection => setFieldValue("readFiles", selection)}
                                error={touched.readFiles ? errors.readFiles : null}
                            />
                        </CreateSampleFields>

                        <CreateSampleButtonArea>
                            <SaveButton altText="Create" />
                            <p>
                                <Icon name="clock" /> This will take some time.
                            </p>
                        </CreateSampleButtonArea>

                        <CreateSampleSidebar
                            as={Sidebar}
                            onUpdate={(type, value) => setFieldValue(`sidebar.${type}`, value)}
                            sampleLabels={values.sidebar.labels}
                            defaultSubtractions={values.sidebar.subtractionIds}
                        />
                    </CreateSampleForm>
                )}
            </Formik>
        </>
    );
};

export const mapStateToProps = state => ({
    error: get(state, "errors.CREATE_SAMPLE_ERROR.message", ""),
    forceGroupChoice: state.settings.data.sample_group === "force_choice",
    groups: state.account.groups,
    readyReads: filter(state.samples.readFiles, { reserved: false }),
    subtractions: getSubtractionShortlist(state),
    allLabels: state.labels.documents
});

export const mapDispatchToProps = dispatch => ({
    onLoadSubtractionsAndFiles: () => {
        dispatch(shortlistSubtractions());
        dispatch(findReadFiles());
    },

    onCreate: (name, isolate, host, locale, libraryType, subtractionIds, files, labels, group) => {
        if (group === null) {
            dispatch(createSample(name, isolate, host, locale, libraryType, subtractionIds, files, labels));
        } else {
            dispatch(createSample(name, isolate, host, locale, libraryType, subtractionIds, files, labels, group));
        }
    },

    onClearError: () => {
        dispatch(clearError("CREATE_SAMPLE_ERROR"));
    },

    onListLabels: () => {
        dispatch(listLabels());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateSample);
