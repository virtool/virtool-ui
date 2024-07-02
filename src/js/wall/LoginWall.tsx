import React from "react";
import { connect } from "react-redux";
import { WallContainer, WallDialog, WallLoginContainer } from "./Container";
import LoginForm from "./LoginForm";
import ResetForm from "./ResetForm";

type LoginWallProps = {
    /** Indicates if the user needs to reset their password. */
    reset: boolean;
};

/** Renders either ResetForm or LoginForm based on the reset state. */
export function LoginWall({ reset }: LoginWallProps) {
    return (
        <WallContainer>
            <WallDialog>
                <WallLoginContainer>
                    {reset ? <ResetForm /> : <LoginForm error="Invalid username or password" />}
                </WallLoginContainer>
            </WallDialog>
        </WallContainer>
    );
}

export function mapStateToProps(state) {
    return {
        reset: state.app.reset,
    };
}

export default connect(mapStateToProps)(LoginWall);
