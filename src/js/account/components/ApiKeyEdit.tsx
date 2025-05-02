import ApiKeyPermissions from "@account/components/ApiKeyPermissions";
import { useUpdateApiKey } from "@account/queries";
import Dialog from "@base/Dialog";
import DialogContent from "@base/DialogContent";
import DialogDescription from "@base/DialogDescription";
import DialogOverlay from "@base/DialogOverlay";
import DialogTitle from "@base/DialogTitle";
import IconButton from "@base/IconButton";
import SaveButton from "@base/SaveButton";
import { Permissions } from "@groups/types";
import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import React from "react";
import { Controller, useForm } from "react-hook-form";

type FormValues = {
    name: string;
    permissions: Permissions;
};

type ApiKeyEditProps = {
    id: string;
    permissions: Permissions;
};

export default function ApiKeyEdit({ id, permissions }: ApiKeyEditProps) {
    const updateMutation = useUpdateApiKey();
    const { handleSubmit, control } = useForm<FormValues>({
        defaultValues: { permissions },
    });

    function onSubmit({ permissions }) {
        updateMutation.mutate({ keyId: id, permissions });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <IconButton name="pen" tip="Edit" />
            </DialogTrigger>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Edit API Key</DialogTitle>
                    <DialogDescription>
                        Modify the permissions for an existing API key.
                    </DialogDescription>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <ApiKeyPermissions
                                    className="mt-4"
                                    keyPermissions={value}
                                    onChange={onChange}
                                />
                            )}
                            name="permissions"
                        />

                        <div className="flex items-center justify-end mb-2.5 gap-1.5">
                            <SaveButton />
                        </div>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
