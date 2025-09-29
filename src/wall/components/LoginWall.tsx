import { useState } from "react";
import LoginForm from "./LoginForm";
import ResetForm from "./ResetForm";
import { WallContainer } from "./WallContainer";

export default function LoginWall() {
    const [resetCode, setResetCode] = useState<string | null>(null);

    return (
        <WallContainer>
            {resetCode ? (
                <ResetForm resetCode={resetCode} />
            ) : (
                <LoginForm setResetCode={setResetCode} />
            )}
        </WallContainer>
    );
}
