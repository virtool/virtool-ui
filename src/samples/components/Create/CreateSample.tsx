import { useNavigate } from "../../../app/hooks";
import { useFetchAccount } from "../../../account/queries";
import Box from "../../../base/Box";
import Icon from "../../../base/Icon";
import InputContainer from "../../../base/InputContainer";
import InputError from "../../../base/InputError";
import InputGroup from "../../../base/InputGroup";
import InputIconButton from "../../../base/InputIconButton";
import InputLabel from "../../../base/InputLabel";
import InputSimple from "../../../base/InputSimple";
import LoadingPlaceholder from "../../../base/LoadingPlaceholder";
import SaveButton from "../../../base/SaveButton";
import ViewHeader from "../../../base/ViewHeader";
import ViewHeaderTitle from "../../../base/ViewHeaderTitle";
import { useInfiniteFindFiles } from "../../../files/queries";
import { FileType } from "../../../files/types";
import { RestoredAlert } from "../../../forms/components/RestoredAlert";
import { usePersistentForm } from "../../../forms/hooks";
import { useListGroups } from "../../../groups/queries";
import ReadSelector from "./ReadSelector";
import Sidebar from "./Sidebar";
import { useCreateSample } from "../../queries";
import { find, flatMap, toString } from "lodash-es";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import styled from "styled-components";
import LibraryTypeSelector from "./LibraryTypeSelector";
import SampleUserGroup from "./SampleUserGroup";

const extensionRegex = /^[a-z0-9]+-(.*)\.f[aq](st)?[aq]?(\.gz)?$/;

/**
 * Gets a filename without extension, given the file ID and an array of all available read files.
 * Used to autofill the name for a new sample based on the selected read file(s).
 *
 * @param id - the file ID
 * @param files - all available read files
 * @returns The filename without its extension
 */
function getFileNameFromId(id: string, files: string[]): string {
    const file = find(files, (file) => file.id === id);
    return file ? file.name_on_disk.match(extensionRegex)[1] : "";
}

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
        font-weight: ${(props) => props.theme.fontWeight.thick};
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

const CreateSampleForm = styled.form`
    display: grid;
    grid-template-columns: minmax(auto, 1150px) max(320px, 10%);
    grid-column-gap: ${(props) => props.theme.gap.column};
`;

const CreateSampleName = styled(InputGroup)`
    grid-column: 1;
    grid-row: 2;
`;

const AlertContainer = styled.div`
    grid-column: 1 / 3;
    grid-row: 1;
`;

type FormValues = {
    name: string;
    isolate: string;
    host: string;
    locale: string;
    libraryType: string;
    readFiles: string[];
    group: string;
    sidebar: { labels: number[]; subtractionIds: string[] };
};

/**
 * A form for creating a sample
 */
export default function CreateSample() {
    const navigate = useNavigate();

    const { data: groups, isPending: isPendingGroups } = useListGroups();
    const { data: account, isPending: isPendingAccount } = useFetchAccount();
    const {
        data: readsResponse,
        isPending: isPendingReads,
        isFetchingNextPage,
        fetchNextPage,
    } = useInfiniteFindFiles(FileType.reads, 25);
    const {
        control,
        formState: { errors },
        hasRestored,
        handleSubmit,
        register,
        reset,
        setValue,
        watch,
    } = usePersistentForm<FormValues>({
        formName: "createSample",
        defaultValues: {
            name: "",
            isolate: "",
            host: "",
            locale: "",
            libraryType: "normal",
            readFiles: [],
            group: "",
            sidebar: {
                labels: [],
                subtractionIds: [],
            },
        },
    });
    const mutation = useCreateSample();

    useEffect(() => {
        setValue("group", toString(account?.primary_group?.id));
    }, [account]);

    if (isPendingReads || isPendingGroups || isPendingAccount) {
        return <LoadingPlaceholder className="mt-9" />;
    }

    const reads = flatMap(readsResponse.pages, (page) => page.items);

    function autofill(selected: string[]) {
        const fileName = getFileNameFromId(selected[0], reads);
        if (fileName) {
            setValue("name", fileName);
        }
    }

    function onSubmit({
        name,
        isolate,
        host,
        locale,
        libraryType,
        readFiles,
        group,
        sidebar,
    }: FormValues) {
        const { labels, subtractionIds } = sidebar;

        mutation.mutate(
            {
                name,
                isolate,
                host,
                locale,
                libraryType,
                subtractions: subtractionIds,
                files: readFiles,
                labels,
                group: group || null,
            },
            {
                onSuccess: () => {
                    reset();
                    navigate("/samples");
                },
            },
        );
    }

    return (
        <>
            <ViewHeader title="Create Sample">
                <ViewHeaderTitle>Create Sample</ViewHeaderTitle>
                <CreateSampleInputError>
                    {mutation.isError && mutation.error.response?.body.message}
                </CreateSampleInputError>
            </ViewHeader>
            <CreateSampleForm onSubmit={handleSubmit(onSubmit)}>
                <AlertContainer>
                    <RestoredAlert
                        hasRestored={hasRestored}
                        name="sample"
                        resetForm={reset}
                    />
                </AlertContainer>
                <CreateSampleName>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <InputContainer align="right">
                        <InputSimple
                            id="name"
                            {...register("name", {
                                required: "Required Field",
                            })}
                        />
                        {Boolean(watch("readFiles").length) && (
                            <InputIconButton
                                name="magic"
                                aria-label="Auto Fill"
                                tip="Auto Fill"
                                onClick={() => autofill(watch("readFiles"))}
                            />
                        )}
                    </InputContainer>
                    <InputError>{errors.name?.message}</InputError>
                </CreateSampleName>
                <CreateSampleFields>
                    <CreateSampleInputs>
                        <Controller
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <SampleUserGroup
                                    selected={value}
                                    groups={groups}
                                    onChange={onChange}
                                />
                            )}
                            name="group"
                        />
                        <InputGroup>
                            <InputLabel htmlFor="locale">Locale</InputLabel>
                            <InputSimple id="locale" {...register("locale")} />
                        </InputGroup>

                        <InputGroup>
                            <InputLabel htmlFor="isolate">Isolate</InputLabel>
                            <InputSimple
                                id="isolate"
                                {...register("isolate")}
                            />
                        </InputGroup>

                        <InputGroup>
                            <InputLabel htmlFor="host">Host</InputLabel>
                            <InputSimple id="host" {...register("host")} />
                        </InputGroup>
                    </CreateSampleInputs>

                    <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <LibraryTypeSelector
                                libraryType={value}
                                onSelect={onChange}
                            />
                        )}
                        name="libraryType"
                    />

                    <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <ReadSelector
                                data={readsResponse}
                                isFetchingNextPage={isFetchingNextPage}
                                fetchNextPage={fetchNextPage}
                                isPending={isPendingReads}
                                selected={value}
                                onSelect={onChange}
                                error={errors.readFiles?.message}
                            />
                        )}
                        name="readFiles"
                        rules={{
                            required:
                                "At least one read file must be attached to the sample",
                        }}
                    />
                </CreateSampleFields>

                <CreateSampleButtonArea>
                    <SaveButton altText="Create" />
                    <p>
                        <Icon name="clock" /> This will take some time.
                    </p>
                </CreateSampleButtonArea>

                <Controller
                    control={control}
                    render={({ field: { value } }) => (
                        <Sidebar
                            defaultSubtractions={value.subtractionIds}
                            onUpdate={setValue}
                            sampleLabels={value.labels}
                        />
                    )}
                    name="sidebar"
                />
            </CreateSampleForm>
        </>
    );
}
