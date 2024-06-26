import React from "react";
import { connect } from "react-redux";
import { WallContainer, WallDialog, WallHeader, WallLoginContainer, WallSubheader } from "./Container";
import LoginForm from "./LoginForm";
import ResetForm from "./ResetForm";
import { WallTitle } from "./WallTitle";

export function LoginWall({ reset }) {
    return (
        <WallContainer>
            <WallDialog>
                <WallLoginContainer>
                    <WallTitle />
                    <WallHeader>{reset ? "Password Reset" : "Login"}</WallHeader>
                    <WallSubheader>
                        {reset
                            ? "You are required to set a new password before proceeding."
                            : "Sign in with your Virtool account"}
                    </WallSubheader>
                    {reset ? <ResetForm /> : <LoginForm />}
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
