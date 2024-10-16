import { usePostDevCommand } from "@/dev/queries";
import { Button, Dialog, DialogContent, DialogOverlay, DialogTitle } from "@base";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useUrlSearchParam } from "@utils/hooks";
import React from "react";
import styled from "styled-components";

export const DeveloperCommand = styled.div`
    align-items: center;
    display: flex;
    padding: 15px;
`;

export const DeveloperCommandLabel = styled.div`
    h3 {
        margin: 0 0 5px;
    }

    p {
        margin: 0;
    }
`;

export const DeveloperCommandControl = styled.div`
    margin-left: auto;
`;

/**
 * Displays a dialog for developer commands
 */
export default function DeveloperDialog() {
    const [openDev, setOpenDev] = useUrlSearchParam("openDev");
    const mutation = usePostDevCommand();

    return (
        <Dialog open={Boolean(openDev)} onOpenChange={() => setOpenDev("")}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent size="lg">
                    <DialogTitle>Developer</DialogTitle>
                    <DeveloperCommand>
                        <DeveloperCommandLabel>
                            <h3>Clear Users</h3>
                            <p>Remove existing users. You will be required to create a first user.</p>
                        </DeveloperCommandLabel>
                        <DeveloperCommandControl>
                            <Button
                                color="red"
                                onClick={() =>
                                    mutation.mutate(
                                        { command: "clear_users" },
                                        {
                                            onSuccess: () => {
                                                setOpenDev("");
                                                location.reload();
                                            },
                                        },
                                    )
                                }
                            >
                                Clear Users
                            </Button>
                        </DeveloperCommandControl>
                    </DeveloperCommand>
                    <DeveloperCommand>
                        <DeveloperCommandLabel>
                            <h3>Create Sample</h3>
                            <p>Creates a sample that is ready for use.</p>
                        </DeveloperCommandLabel>
                        <DeveloperCommandControl>
                            <Button color="red" onClick={() => mutation.mutate({ command: "create_sample" })}>
                                Create Sample
                            </Button>
                        </DeveloperCommandControl>
                    </DeveloperCommand>
                    <DeveloperCommand>
                        <DeveloperCommandLabel>
                            <h3>Create Subtraction</h3>
                            <p>Creates a subtraction that is ready for use.</p>
                        </DeveloperCommandLabel>
                        <DeveloperCommandControl>
                            <Button color="red" onClick={() => mutation.mutate({ command: "create_subtraction" })}>
                                Create Subtraction
                            </Button>
                        </DeveloperCommandControl>
                    </DeveloperCommand>
                    <DeveloperCommand>
                        <DeveloperCommandLabel>
                            <h3>Create Subtraction</h3>
                            <p>Creates a subtraction that is ready for use.</p>
                        </DeveloperCommandLabel>
                        <DeveloperCommandControl>
                            <Button color="red" onClick={() => mutation.mutate({ command: "create_subtraction" })}>
                                Create Subtraction
                            </Button>
                        </DeveloperCommandControl>
                    </DeveloperCommand>
                    <DeveloperCommand>
                        <DeveloperCommandLabel>
                            <h3>Force Delete Jobs</h3>
                            <p>Forces cancellation, then deletion of all jobs regardless of status.</p>
                        </DeveloperCommandLabel>
                        <DeveloperCommandControl>
                            <Button color="red" onClick={() => mutation.mutate({ command: "force_delete_jobs" })}>
                                Force Delete Jobs
                            </Button>
                        </DeveloperCommandControl>
                    </DeveloperCommand>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
