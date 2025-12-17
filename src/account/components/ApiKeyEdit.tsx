import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@base/Dialog";
import IconButton from "@base/IconButton";
import SaveButton from "@base/SaveButton";
import { Permissions } from "@groups/types";
import { Controller, useForm } from "react-hook-form";
import { useUpdateApiKey } from "../queries";
import ApiKeyPermissions from "./ApiKeyPermissions";

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
        </Dialog>
    );
}
