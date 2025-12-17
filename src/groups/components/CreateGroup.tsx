import { useDialogParam } from "@app/hooks";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@base/Dialog";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import SaveButton from "@base/SaveButton";
import { useForm } from "react-hook-form";
import { useCreateGroup } from "../queries";

type FormValues = {
    name: string;
};

/**
 * A dialog for creating a new group
 */
export default function CreateGroup() {
    const { open: openCreateGroup, setOpen: setOpenCreateGroup } =
        useDialogParam("openCreateGroup");
    const createGroupMutation = useCreateGroup();
    const {
        formState: { errors },
        register,
        handleSubmit,
    } = useForm<FormValues>({ defaultValues: { name: "" } });

    function onSubmit({ name }: FormValues) {
        createGroupMutation.mutate(
            { name },
            {
                onSuccess: () => {
                    setOpenCreateGroup(false);
                },
            },
        );
    }

    return (
        <Dialog
            open={openCreateGroup}
            onOpenChange={() => setOpenCreateGroup(false)}
        >
            <DialogContent>
                <DialogTitle>Create Group</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputGroup>
                        <InputLabel>Name</InputLabel>
                        <InputSimple
                            id="name"
                            {...register("name", {
                                required: "Provide a name for the group",
                            })}
                        />
                        <InputError>{errors.name?.message}</InputError>
                    </InputGroup>
                    <DialogFooter>
                        <SaveButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
