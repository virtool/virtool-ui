import { getLoginRequest } from "@app/authConfig";
import { getColor } from "@app/theme";
import { Button, DividerHorizontal } from "@base";
import React, { useState } from "react";
import styled from "styled-components";
import { WallSubheader } from "./Container";

const StyledB2CLogin = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
`;

const BetaTag = styled.span`
    color: ${props => getColor({ color: "greyDark", theme: props.theme })};
    margin-left: auto;
    text-transform: uppercase;
`;

const LoginDivider = styled(DividerHorizontal)`
    margin: 10px 5px 20px;
`;

export default function B2CLogin() {
    const [reset, setReset] = useState<boolean>(true);

    function onLogin(msal) {
        window.msalInstance.setActiveAccount(msal.account);
        setReset(false);
    }

    return reset ? (
        <>
            <StyledB2CLogin>
                <WallSubheader>Sign in with your work account</WallSubheader>
                <Button onClick={() => window.msalInstance.loginPopup(getLoginRequest()).then(onLogin)}>Sign in</Button>
                <BetaTag>Beta</BetaTag>
            </StyledB2CLogin>
            <LoginDivider text="or" />
        </>
    ) : null;
}
