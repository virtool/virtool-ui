import APIPermissions from "@account/components/API/APIPermissions";
import { useCreateAPIKey } from "@account/queries";
import { getFontSize } from "@app/theme";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogOverlay,
    DialogTitle,
    Icon,
    Input,
    InputContainer,
    InputError,
    InputGroup,
    InputIconButton,
    InputLabel,
    InputSimple,
    SaveButton,
} from "@base";
import { Permissions } from "@groups/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useUrlSearchParams } from "@utils/hooks";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import CreateAPIKeyInfo from "./APIKeyAdministratorInfo";

const CreateAPIKeyCopied = styled.p`
    color: ${props => props.theme.color.blue};
`;

const CreateAPIKeyInput = styled(Input)`
    text-align: center;
`;

const CreateAPIKeyInputContainer = styled(InputContainer)`
    margin-top: 15px;
    margin-bottom: 10px;
`;

const StyledCreateAPIKey = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;

    strong {
        color: ${props => props.theme.color.greenDark};
        font-size: ${getFontSize("lg")};
        margin-bottom: 5px;
    }
`;

type FormValues = {
    name: string;
    permissions: Permissions;
};

/**
 * Displays a dialog to create an API key
 */
export default function CreateAPIKey() {
    const [newKey, setNewKey] = useState("");
    const [copied, setCopied] = useState(false);
    const [showCreated, setShowCreated] = useState(false);
    const mutation = useCreateAPIKey();
    const [openCreateKey, setOpenCreateKey] = useUrlSearchParams("openCreateKey");

    const {
        formState: { errors },
        handleSubmit,
        control,
        register,
    } = useForm<FormValues>({
        defaultValues: {
            name: "",
            permissions: {
                cancel_job: false,
                create_ref: false,
                create_sample: false,
                modify_hmm: false,
                modify_subtraction: false,
                remove_file: false,
                remove_job: false,
                upload_file: false,
            },
        },
    });

    useEffect(() => {
        if (!showCreated && newKey) {
            setShowCreated(true);
        }
    }, [newKey]);

    function handleHide() {
        setCopied(false);
        setShowCreated(false);
        setOpenCreateKey("");
    }

    function onSubmit({ name, permissions }: FormValues) {
        mutation.mutate(
            { name, permissions },
            {
                onSuccess: data => {
                    setNewKey(data.key);
                },
            },
        );
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(newKey).then(() => setCopied(true));
    }

    return (
        <Dialog open={Boolean(openCreateKey)} onOpenChange={handleHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Create API Key</DialogTitle>
                    {showCreated ? (
                        <StyledCreateAPIKey>
                            <strong>Here is your key.</strong>
                            <p>Make note of it now. For security purposes, it will not be shown again.</p>

                            <CreateAPIKeyInputContainer align="right">
                                <CreateAPIKeyInput value={newKey} readOnly />
                                {window.isSecureContext && (
                                    <InputIconButton
                                        aria-label="copy"
                                        name="copy"
                                        tip="Copy"
                                        onClick={copyToClipboard}
                                    />
                                )}
                            </CreateAPIKeyInputContainer>
                            {copied && (
                                <CreateAPIKeyCopied>
                                    <Icon name="check" /> Copied
                                </CreateAPIKeyCopied>
                            )}
                        </StyledCreateAPIKey>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CreateAPIKeyInfo />
                            <InputGroup>
                                <InputLabel htmlFor="name">Name</InputLabel>
                                <InputSimple
                                    id="name"
                                    aria-invalid={errors.name ? "true" : "false"}
                                    {...register("name", { required: "Provide a name for the key" })}
                                />
                                <InputError>{errors.name?.message}</InputError>
                            </InputGroup>

                            <label>Permissions</label>

                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <APIPermissions keyPermissions={value} onChange={onChange} />
                                )}
                                name="permissions"
                            />

                            <DialogFooter>
                                <SaveButton />
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
