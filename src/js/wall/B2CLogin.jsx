import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { loginSucceeded } from "../account/actions";
import { getLoginRequest } from "../app/authConfig";
import { getColor } from "../app/theme";
import { Button, HorizontalDivider } from "../base";
import { WallSubheader } from "./Container";

const StyledB2CLogin = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
`;

const BetaTag = styled.span`
    color: ${props => getColor({ color: "greyDark", theme: props.theme })};
    margin-left: auto;
    transform-text: uppercase;
`;

const LoginDivider = styled(HorizontalDivider)`
    margin: 10px 5px 20px;
`;

export const B2CLogin = ({ onSetLogin }) => {
    const onLogin = msal => {
        window.msalInstance.setActiveAccount(msal.account);
        onSetLogin();
    };
    return (
        <>
            <StyledB2CLogin>
                <WallSubheader>Sign in with your work account</WallSubheader>
                <Button onClick={() => window.msalInstance.loginPopup(getLoginRequest()).then(onLogin)}>Sign in</Button>
                <BetaTag>Beta</BetaTag>
            </StyledB2CLogin>
            <LoginDivider text="or" />
        </>
    );
};

export const mapDispatchToProps = dispatch => ({
    onSetLogin: () => {
        dispatch(loginSucceeded());
    }
});

export default connect(null, mapDispatchToProps)(B2CLogin);
