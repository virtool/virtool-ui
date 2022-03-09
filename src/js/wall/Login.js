import { get } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { login, loginSucceeded } from "../account/actions";
import { BoxGroupSection, Button, Checkbox, Input, InputGroup, InputLabel, PasswordInput } from "../base";
import { clearError } from "../errors/actions";
import { WallContainer, WallDialog, WallDialogFooter, WallLogo } from "./Container";
import { getLoginRequest } from "../app/authConfig";

const LoginFooter = styled(WallDialogFooter)`
    border: none;
    button: last-child {
        margin-left: 5px;
    }
`;

const LoginError = styled.span`
    color: red;
    margin-left: auto;
    font-size: 12px;
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
                <WallLogo height={42} />
                <WallDialog>
                    <form onSubmit={this.handleSubmit}>
                        <BoxGroupSection>
                            <InputGroup>
                                <InputLabel>Username</InputLabel>
                                <Input
                                    name="username"
                                    value={this.state.username}
                                    onChange={this.handleChange}
                                    autoFocus
                                />
                            </InputGroup>
                            <InputGroup>
                                <InputLabel>Password</InputLabel>
                                <PasswordInput
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                />
                            </InputGroup>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <Checkbox
                                    checked={this.state.remember}
                                    onClick={this.handleRemember}
                                    label="Remember Me"
                                />
                                <LoginError>{this.props.error}</LoginError>
                            </div>
                        </BoxGroupSection>

                        <LoginFooter>
                            <div>
                                {window.b2c.use && (
                                    <Button
                                        onClick={() =>
                                            window.msalInstance.loginPopup(getLoginRequest()).then(this.props.setLogin)
                                        }
                                    >
                                        Login Via B2C
                                    </Button>
                                )}
                                <Button type="submit" color="blue">
                                    Login
                                </Button>
                            </div>
                        </LoginFooter>
                    </form>
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
    },
    setLogin: msal => {
        window.msalInstance.setActiveAccount(msal.account);
        dispatch(loginSucceeded());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
