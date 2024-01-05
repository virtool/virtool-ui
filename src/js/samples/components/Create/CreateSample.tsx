import { Field, Form, Formik, FormikErrors, FormikTouched } from "formik";
import { find, flatMap, intersectionWith } from "lodash-es";
import React from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { useFetchAccount } from "../../../account/querys";
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
import { useInfiniteFindFiles } from "../../../files/querys";
import { FileType } from "../../../files/types";
import { deletePersistentFormState } from "../../../forms/actions";
import PersistForm from "../../../forms/components/PersistForm";
import { useListGroups } from "../../../groups/querys";
import { useFetchLabels } from "../../../labels/hooks";
import { useFetchSubtractionsShortlist } from "../../../subtraction/querys";
import { ErrorResponse } from "../../../types/types";
import { User } from "../../../users/types";
import { create } from "../../api";
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
function getFileNameFromId(id, files) {
    const file = find(files, file => file.id === id);
    return file ? file.name_on_disk.match(extensionRegex)[1] : "";
}

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

function castValues(subtractions, allLabels) {
    return function (values) {
        const labels = intersectionWith(values.sidebar.labels, allLabels, (label, allLabel) => label === allLabel.id);
        const subtractionIds = intersectionWith(
            values.sidebar.subtractionIds,
            subtractions,
            (subtractionId, subtraction) => subtractionId === subtraction.id,
        );
        return { ...values, sidebar: { labels, subtractionIds } };
    };
}

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

function getInitialValues(account: User) {
    return {
        name: "",
        isolate: "",
        host: "",
        locale: "",
        libraryType: "normal",
        readFiles: [],
        group: account.primary_group?.id || null,
        sidebar: { labels: [], subtractionIds: [] },
    };
}

/**
 * A form for creating a sample
 */
export default function CreateSample() {
    const { data: allLabels, isLoading: isLoadingLabels } = useFetchLabels();
    const { data: groups, isLoading: isLoadingGroups } = useListGroups();
    const { data: subtractions, isLoading: isLoadingSubtractions } = useFetchSubtractionsShortlist();
    const { data: account, isLoading: isLoadingAccount } = useFetchAccount();
    const {
        data: readsResponse,
        isLoading: isLoadingReads,
        isFetchingNextPage,
        fetchNextPage,
    } = useInfiniteFindFiles(FileType.reads, 25);

    const history = useHistory();
    const dispatch = useDispatch();
    const samplesMutation = useMutation(create, {
        onSuccess: () => {
            history.push("/samples");
            dispatch(deletePersistentFormState("create-sample"));
        },
    });

    if (isLoadingReads || isLoadingLabels || isLoadingSubtractions || isLoadingGroups || isLoadingAccount) {
        return <LoadingPlaceholder margin="36px" />;
    }

    function onCreate(name, isolate, host, locale, libraryType, subtractionIds, files, labels, group) {
        samplesMutation.mutate({
            name,
            isolate,
            host,
            locale,
            libraryType,
            subtractions: subtractionIds,
            files,
            labels,
            group,
        });
    }

    const reads = flatMap(readsResponse.pages, page => page.items);

    function autofill(selected, setFieldValue) {
        const fileName = getFileNameFromId(selected[0], reads);
        if (fileName) {
            setFieldValue("name", fileName);
        }
    }

    function handleSubmit(values) {
        const { name, isolate, host, locale, libraryType, readFiles, group, sidebar } = values;
        const { subtractionIds, labels } = sidebar;

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
    }

    return (
        <>
            <ViewHeader title="Create Sample">
                <ViewHeaderTitle>Create Sample</ViewHeaderTitle>
                <CreateSampleInputError>
                    {samplesMutation.isError && (samplesMutation.error as ErrorResponse).response.body.message}
                </CreateSampleInputError>
            </ViewHeader>
            <Formik
                onSubmit={handleSubmit}
                initialValues={getInitialValues(account)}
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
                            <PersistForm formName="create-sample" castValues={castValues(subtractions, allLabels)} />
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
                                data={readsResponse}
                                isFetchingNextPage={isFetchingNextPage}
                                fetchNextPage={fetchNextPage}
                                isLoading={isLoadingReads}
                                selected={values.readFiles}
                                onSelect={(selection: string) => setFieldValue("readFiles", selection)}
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
