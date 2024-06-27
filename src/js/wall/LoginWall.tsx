import React from "react";
import { connect } from "react-redux";
import { WallContainer, WallDialog, WallLoginContainer } from "./Container";
import LoginForm from "./LoginForm";
import ResetForm from "./ResetForm";

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
