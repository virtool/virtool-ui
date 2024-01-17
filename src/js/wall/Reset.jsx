import { get } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { resetPassword } from "../account/actions";
import { InputError, InputGroup, InputLabel, InputPassword } from "../base";
import { WallButton, WallContainer, WallDialog, WallHeader, WallLoginContainer, WallSubheader } from "./Container";
import { WallTitle } from "./WallTitle";

export class Reset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
        };
    }

    componentDidMount() {
        this.setState({
            resetCode: this.props.resetCode,
        });
    }

    handleChange = e => {
        this.setState({ password: e.target.value });
    };

    handleSubmit = e => {
        e.preventDefault();

        if (!this.state.password.length < 8) {
            this.props.onReset(this.state.password, this.state.resetCode);
        }
    };

    render() {
        return (
            <WallContainer>
                <WallDialog>
                    <WallLoginContainer>
                        <WallTitle />
                        <WallHeader>Password Reset</WallHeader>
                        <WallSubheader>You are required to set a new password before proceeding.</WallSubheader>

                        <form onSubmit={this.handleSubmit}>
                            <InputGroup>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <InputPassword
                                    name="password"
                                    id="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                />
                                <InputError>{this.props.error}</InputError>
                            </InputGroup>
                            <WallButton type="submit" color="blue">
                                Reset
                            </WallButton>
                        </form>
                    </WallLoginContainer>
                </WallDialog>
            </WallContainer>
        );
    }
}

export const mapStateToProps = state => ({
    error: get(state, "errors.RESET_PASSWORD_ERROR.message"),
    resetCode: get(state, "app.resetCode"),
});

export const mapDispatchToProps = dispatch => ({
    onReset: (password, resetCode) => {
        dispatch(resetPassword(password, resetCode));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Reset);
