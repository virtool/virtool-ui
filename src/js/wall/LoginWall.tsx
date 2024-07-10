import React, { useState } from "react";
import { WallContainer, WallDialog, WallLoginContainer } from "./Container";
import LoginForm from "./LoginForm";
import ResetForm from "./ResetForm";

export default function LoginWall() {
    const [resetCode, setResetCode] = useState<string | null>("a");

    return (
        <WallContainer>
            <WallDialog>
                <WallLoginContainer>
                    {resetCode ? <ResetForm resetCode={resetCode} /> : <LoginForm setResetCode={setResetCode} />}
                </WallLoginContainer>
            </WallDialog>
        </WallContainer>
    );
}
