import { useDialogParam } from "@app/hooks";
import { cn } from "@app/utils";
import Button from "@base/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@base/Dialog";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import PseudoLabel from "@base/PseudoLabel";
import SaveButton from "@base/SaveButton";
import { Permissions } from "@groups/types";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCreateAPIKey } from "../queries";
import CreateAPIKeyInfo from "./ApiKeyAdministratorInfo";
import ApiKeyPermissions from "./ApiKeyPermissions";

type FormValues = {
    name: string;
    permissions: Permissions;
};

/**
 * Displays a dialog to create an API key
 */
export default function ApiKeyCreate() {
    const [copied, setCopied] = useState(false);
    const [newKey, setNewKey] = useState("");
    const mutation = useCreateAPIKey();
    const { open: openCreateKey, setOpen: setOpenCreateKey } =
        useDialogParam("openCreateKey");

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

    const showCreated = Boolean(newKey);

    function handleHide() {
        setCopied(false);
        setOpenCreateKey(false);
        setNewKey("");
    }

    function onSubmit({ name, permissions }: FormValues) {
        mutation.mutate(
            { name, permissions },
            {
                onSuccess: (data) => {
                    setNewKey(data.key);
                },
            },
        );
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(newKey).then(() => setCopied(true));
    }

    return (
        <Dialog open={openCreateKey} onOpenChange={handleHide}>
            <DialogContent>
                <DialogTitle>Create API Key</DialogTitle>
                <DialogDescription>
                    Create a new key for accessing the Virtool API.
                </DialogDescription>
                {showCreated ? (
                    <div className="flex flex-col items-center mt-10 mb-4">
                        <p className="font-medium text-lg">Here is your key.</p>
                        <p className="font-medium mb-4 text-slate-600">
                            Make note of it now. For security purposes, it will
                            not be shown again.
                        </p>

                        <div className="flex items-stretch mb-2 w-full">
                            <InputSimple
                                className="w-full"
                                value={newKey}
                                readOnly
                            />
                            {window.isSecureContext && (
                                <Button
                                    className="ml-2"
                                    color="blue"
                                    onClick={copyToClipboard}
                                >
                                    Copy
                                </Button>
                            )}
                        </div>
                        <p
                            className={cn("font-medium text-sm text-cyan-700", {
                                invisible: !copied,
                            })}
                        >
                            Copied
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CreateAPIKeyInfo />
                        <InputGroup>
                            <InputLabel htmlFor="name">Name</InputLabel>
                            <InputSimple
                                id="name"
                                aria-invalid={errors.name ? "true" : "false"}
                                {...register("name", {
                                    required: "Provide a name for the key",
                                })}
                            />
                            <InputError>{errors.name?.message}</InputError>
                        </InputGroup>

                        <PseudoLabel>Permissions</PseudoLabel>
                        <Controller
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <ApiKeyPermissions
                                    keyPermissions={value}
                                    onChange={onChange}
                                />
                            )}
                            name="permissions"
                        />

                        <DialogFooter>
                            <SaveButton />
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
