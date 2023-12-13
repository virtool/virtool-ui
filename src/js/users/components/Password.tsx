import React, { useState } from "react";
import styled from "styled-components";
import { useUpdateUser } from "../../administration/querys";
import {
    BoxGroup,
    BoxGroupHeader,
    BoxGroupSection,
    Checkbox,
    InputContainer,
    InputError,
    InputGroup,
    InputPassword,
    RelativeTime,
    SaveButton,
} from "../../base";

const PasswordFooter = styled.div`
    align-items: center;
    display: flex;

    button {
        margin-left: auto;
    }
`;

type PasswordProps = {
    /** The users unique id */
    id: string;
    /** Whether the user will be forced to reset their password on next login */
    forceReset: boolean;
    /** The iso formatted date of their last password change */
    lastPasswordChange: string;
};

/**
 * The password view to handle password change
 */
export default function Password({ id, forceReset, lastPasswordChange }: PasswordProps) {
    const [password, setPassword] = useState("");
    const mutation = useUpdateUser();

    function handleSetForceReset() {
        mutation.mutate({
            userId: id,
            update: {
                force_reset: !forceReset,
            },
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        mutation.mutate({ userId: id, update: { password: password } });
    }

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>Change Password</h2>
                <p>
                    Last changed <RelativeTime time={lastPasswordChange} />
                </p>
            </BoxGroupHeader>

            <BoxGroupSection as="form" onSubmit={handleSubmit}>
                <InputGroup>
                    <InputContainer>
                        <InputPassword
                            aria-label="password"
                            name="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <InputError>{mutation.isError && mutation.error["response"].body.message}</InputError>
                    </InputContainer>
                </InputGroup>

                <PasswordFooter>
                    <Checkbox
                        label="Force user to reset password on next login"
                        checked={forceReset}
                        onClick={handleSetForceReset}
                    />
                    <SaveButton />
                </PasswordFooter>
            </BoxGroupSection>
        </BoxGroup>
    );
}
