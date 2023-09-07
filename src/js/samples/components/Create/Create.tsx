import { Field, Form, Formik, FormikErrors, FormikTouched } from "formik";
import { filter, find, get, intersectionWith } from "lodash-es";
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
    ViewHeaderTitle,
} from "../../../base";
import { clearError } from "../../../errors/actions";
import { useListFiles } from "../../../files/querys";
import { FileType, UnpaginatedFileResponse } from "../../../files/types";
import PersistForm from "../../../forms/components/PersistForm";
import { listLabels } from "../../../labels/actions";
import { shortlistSubtractions } from "../../../subtraction/actions";
import { getSubtractionShortlist } from "../../../subtraction/selectors";
import { createSample } from "../../actions";
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
    readFiles: Yup.array().min(1, "At least one read file must be attached to the sample"),
});

const CreateSampleButtonArea = styled(Box)`
    align-items: center;
    background-color: #bfdbfe;
    border: none;
    display: flex;
    grid-column: 2;
    grid-row: 2;
    margin-top: 25px;
    padding: 15px;

    p {
        color: #1e40af;
        font-weight: ${props => props.theme.fontWeight.thick};
        margin: 0 0 0 auto;
        padding-left: 15px;
        text-align: center;
    }
`;

const CreateSampleFields = styled.div`
    grid-row: 3;
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
    grid-row: 2;
`;

const SampleSidebar = styled(Field)`
    grid-row: 3;
`;

const AlertContainer = styled.div`
    grid-column: 1 / 3;
    grid-row: 1;
`;

const castValues = (reads, subtractions, allLabels) => values => {
    const readFiles = intersectionWith(values.readFiles, reads, (readFile, read) => readFile === read.id);
    const labels = intersectionWith(values.sidebar.labels, allLabels, (label, allLabel) => label === allLabel.id);
    const subtractionIds = intersectionWith(
        values.sidebar.subtractionIds,
        subtractions,
        (subtractionId, subtraction) => subtractionId === subtraction.id,
    );
    return { ...values, readFiles, sidebar: { labels, subtractionIds } };
};

type formValues = {
    name: string;
    isolate: string;
    host: string;
    locale: string;
    libraryType: string;
    readFiles: string[];
    group: string;
    sidebar: { labels: number[]; subtractionIds: string[] };
};

const getInitialValues = forceGroupChoice => ({
    name: "",
    isolate: "",
    host: "",
    locale: "",
    libraryType: "normal",
    readFiles: [],
    group: forceGroupChoice ? "none" : null,
    sidebar: { labels: [], subtractionIds: [] },
});

export function CreateSample({
    error,
    forceGroupChoice,
    groups,
    subtractions,
    allLabels,
    onLoadSubtractionsAndFiles,
    onCreate,
    onClearError,
    onListLabels,
}) {
    useEffect(() => {
        onLoadSubtractionsAndFiles();
        onListLabels();
    }, []);

    const { data: readsResponse, isLoading: isReadsLoading }: { data: UnpaginatedFileResponse; isLoading: boolean } =
        useListFiles(FileType.reads, false);

    if (subtractions === null || allLabels === null || isReadsLoading) {
        return <LoadingPlaceholder margin="36px" />;
    }

    const reads = filter(readsResponse.documents, { reserved: false });

    const autofill = (selected, setFieldValue) => {
        const fileName = getFileNameFromId(selected[0], reads);
        if (fileName) {
            setFieldValue("name", fileName);
        }
    };

    const handleSubmit = values => {
        const { name, isolate, host, locale, libraryType, readFiles, group, sidebar } = values;
        const { subtractionIds, labels } = sidebar;
        // Only send the group if forceGroupChoice is true
        if (forceGroupChoice) {
            onCreate(
                name,
                isolate,
                host,
                locale,
                libraryType,
                subtractionIds,
                readFiles,
                labels,
                group === "none" ? "" : group,
            );
        } else {
            onCreate(name, isolate, host, locale, libraryType, subtractionIds, readFiles, labels);
        }
    };
    return (
        <>
            <ViewHeader title="Create Sample">
                <ViewHeaderTitle>Create Sample</ViewHeaderTitle>
                <CreateSampleInputError>{error}</CreateSampleInputError>
            </ViewHeader>
            <Formik
                onSubmit={handleSubmit}
                initialValues={getInitialValues(forceGroupChoice)}
                validationSchema={validationSchema}
            >
                {({
                    errors,
                    setFieldValue,
                    touched,
                    values,
                }: {
                    errors: FormikErrors<formValues>;
                    setFieldValue: (field: string, value: string) => void;
                    touched: FormikTouched<formValues>;
                    values: formValues;
                }) => (
                    <CreateSampleForm>
                        <AlertContainer>
                            <PersistForm
                                formName="create-sample"
                                castValues={castValues(reads, subtractions, allLabels)}
                            />
                        </AlertContainer>
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
                                {Boolean(values.readFiles.length) && (
                                    <InputIcon
                                        name="magic"
                                        aria-label="Auto Fill"
                                        onClick={() => autofill(values.readFiles, setFieldValue)}
                                    />
                                )}
                            </InputContainer>
                            {touched.name && <InputError>{errors.name}</InputError>}
                        </CreateSampleName>
                        <CreateSampleFields>
                            <CreateSampleInputs>
                                <Field
                                    as={SampleUserGroup}
                                    aria-label="User GroupItem"
                                    name="group"
                                    selected={values.group}
                                    groups={groups}
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
                                files={reads}
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
                        <SampleSidebar
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
}

export const mapStateToProps = state => ({
    error: get(state, "errors.CREATE_SAMPLE_ERROR.message", ""),
    forceGroupChoice: state.settings.data.sample_group === "force_choice",
    groups: state.account.groups,
    subtractions: getSubtractionShortlist(state),
    allLabels: state.labels.documents,
});

export const mapDispatchToProps = dispatch => ({
    onLoadSubtractionsAndFiles: () => {
        dispatch(shortlistSubtractions());
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
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateSample);
