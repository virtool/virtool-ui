import React from "react";
import { connect } from "react-redux";
import { WallContainer, WallDialog, WallLoginContainer } from "./Container";
import LoginForm from "./LoginForm";
import ResetForm from "./ResetForm";

/**
 * Renders either ResetForm or LoginForm based on the reset state.
 *
 * @param {boolean} reset - Indicates if the user needs to reset their password.
 */
export function LoginWall({ reset }) {
    return (
        <WallContainer>
            <WallDialog>
                <WallLoginContainer>{reset ? <ResetForm /> : <LoginForm />}</WallLoginContainer>
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
