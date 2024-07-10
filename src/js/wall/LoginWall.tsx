import React, { useState } from "react";
import { WallContainer, WallDialog, WallLoginContainer } from "./Container";
import LoginForm from "./LoginForm";
import ResetForm from "./ResetForm";

function LoginWall() {
    const [resetCode, setResetCode] = useState<string | null>(null);

    return (
        <WallContainer>
            <WallDialog>
                <WallLoginContainer>
                    {resetCode ? (
                        <ResetForm error="Invalid password" resetCode={resetCode} />
                    ) : (
                        <LoginForm setResetCode={setResetCode} />
                    )}
                </WallLoginContainer>
            </WallDialog>
        </WallContainer>
    );
}

export default LoginWall;
