import { DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { pushState } from "../../app/actions";
import { Button, Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../base";
import { routerLocationHasState } from "../../utils/utils";
import { postDevCommand } from "../actions";

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

export const DeveloperDialog = ({ show, onCommand, onHide }) => (
    <Dialog open={show} size="lg" onOpenChange={onHide}>
        <DialogPortal>
            <DialogOverlay />
            <DialogContent>
                <DialogTitle>Developer</DialogTitle>
                <DeveloperCommand>
                    <DeveloperCommandLabel>
                        <h3>Clear Users</h3>
                        <p>Remove existing users. You will be required to create a first user.</p>
                    </DeveloperCommandLabel>
                    <DeveloperCommandControl>
                        <Button color="red" onClick={() => onCommand("clear_users")}>
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
                        <Button color="red" onClick={() => onCommand("create_sample")}>
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
                        <Button color="red" onClick={() => onCommand("create_subtraction")}>
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
                        <Button color="red" onClick={() => onCommand("create_subtraction")}>
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
                        <Button color="red" onClick={() => onCommand("force_delete_jobs")}>
                            Force Delete Jobs
                        </Button>
                    </DeveloperCommandControl>
                </DeveloperCommand>
            </DialogContent>
        </DialogPortal>
    </Dialog>
);

export const mapStateToProps = state => ({
    show: routerLocationHasState(state, "devCommands"),
});

export const mapDispatchToProps = dispatch => ({
    onCommand: command => {
        dispatch(postDevCommand(command));
    },

    onHide: () => {
        dispatch(pushState({ devCommands: false }));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(DeveloperDialog);
