import {
    BoxGroup,
    BoxGroupHeader,
    BoxGroupSection,
    Input,
    InputContainer,
    InputError,
    InputGroup,
    InputLabel,
    SaveButton,
} from "@base";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { updateAccount } from "../actions";

const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const EmailForm = styled(BoxGroupSection).attrs(() => ({ as: "form" }))`
    display: flex;
    flex-direction: column;

    button {
        align-self: flex-end;
    }
`;

class Email extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.email || "",
            error: "",
        };
    }

    handleChange = e => {
        this.setState({
            email: e.target.value,
            error: "",
        });
    };

    handleBlur = e => {
        if (!e.relatedTarget) {
            this.setState({
                email: this.props.email,
                error: "",
            });
        }
    };

    handleSubmit = e => {
        e.preventDefault();

        if (!re.test(this.state.email)) {
            return this.setState({ error: "Please provide a valid email address" });
        }

        this.props.onUpdateEmail(this.state.email);
    };

    render() {
        return (
            <BoxGroup>
                <BoxGroupHeader>
                    <h2>Email</h2>
                </BoxGroupHeader>
                <EmailForm onSubmit={this.handleSubmit}>
                    <InputGroup>
                        <InputLabel htmlFor="email">Email Address</InputLabel>
                        <InputContainer>
                            <Input
                                id="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                                onBlur={this.handleBlur}
                            />
                            <InputError>{this.state.error}</InputError>
                        </InputContainer>
                    </InputGroup>
                    <SaveButton />
                </EmailForm>
            </BoxGroup>
        );
    }
}

function mapStateToProps(state) {
    return {
        email: state.account.email,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onUpdateEmail: email => {
            dispatch(updateAccount(email));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Email);
