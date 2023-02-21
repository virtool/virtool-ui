import { get } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { login } from "../account/actions";
import { BoxGroupSection, Checkbox, Input, InputGroup, InputLabel, InputPassword } from "../base";
import { clearError } from "../errors/actions";
import B2cLogin from "./B2CLogin";
import {
    WallButton,
    WallContainer,
    WallDialog,
    WallHeader,
    WallLoginContainer,
    WallSubheader,
    WallTitle
} from "./Container";

const LoginError = styled.div`
    color: red;
    margin-left: auto;
    margin-bottom: 10px;
    font-size: 12px;
    height: 10px;
`;

const LoginButton = styled(WallButton)`
    margin-top: 20px;
`;

const LoginContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
`;

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            remember: false
        };
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });

        if (this.props.error) {
            this.props.onChange();
        }
    };

    handleSubmit = e => {
        e.preventDefault();
        const { username, password, remember } = this.state;
        this.props.onLogin(username, password, remember);
    };

    handleRemember = () => {
        this.setState({
            remember: !this.state.remember
        });
    };

    render() {
        return (
            <WallContainer>
                <WallDialog>
                    <WallLoginContainer>
                        <BoxGroupSection>
                            <WallTitle />
                            <WallHeader>Login</WallHeader>
                            {window.b2c.use && <B2cLogin />}
                            <form onSubmit={this.handleSubmit}>
                                <WallSubheader>
                                    Sign in with your {window.b2c.use && "legacy"} Virtool account
                                </WallSubheader>
                                <InputGroup>
                                    <InputLabel htmlFor="username">Username</InputLabel>
                                    <Input
                                        name="username"
                                        id="username"
                                        value={this.state.username}
                                        onChange={this.handleChange}
                                        autoFocus
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <InputLabel htmlFor="password">Password</InputLabel>
                                    <InputPassword
                                        name="password"
                                        id="password"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                    />
                                </InputGroup>
                                <LoginContainer>
                                    <Checkbox
                                        checked={this.state.remember}
                                        onClick={this.handleRemember}
                                        label="Remember Me"
                                    />
                                    <LoginError>{this.props.error}</LoginError>
                                </LoginContainer>

                                <LoginButton type="submit" color="blue">
                                    Login
                                </LoginButton>
                            </form>
                        </BoxGroupSection>
                    </WallLoginContainer>
                </WallDialog>
            </WallContainer>
        );
    }
}

export const mapStateToProps = state => ({
    error: get(state, "errors.LOGIN_ERROR.message")
});

export const mapDispatchToProps = dispatch => ({
    onChange: () => {
        dispatch(clearError("LOGIN_ERROR"));
    },
    onLogin: (username, password, remember) => {
        dispatch(login(username, password, remember));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
