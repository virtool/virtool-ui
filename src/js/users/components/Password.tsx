import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useUpdateUser } from "../../administration/queries";
import {
    BoxGroup,
    BoxGroupHeader,
    BoxGroupSection,
    Checkbox,
    InputContainer,
    InputError,
    InputGroup,
    InputSimple,
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
export default function Password({
    id,
    forceReset,
    lastPasswordChange,
}: PasswordProps) {
    const mutation = useUpdateUser();
    const {
        formState: { errors },
        handleSubmit,
        register,
    } = useForm({ defaultValues: { password: "" } });

    function handleSetForceReset() {
        mutation.mutate({
            userId: id,
            update: {
                force_reset: !forceReset,
            },
        });
    }

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>Change Password</h2>
                <p>
                    Last changed <RelativeTime time={lastPasswordChange} />
                </p>
            </BoxGroupHeader>

            <BoxGroupSection>
                <form
                    onSubmit={handleSubmit((values) =>
                        mutation.mutate({
                            userId: id,
                            update: { password: values.password },
                        }),
                    )}
                >
                    <InputGroup>
                        <InputContainer>
                            <InputSimple
                                aria-label="password"
                                id="password"
                                type="password"
                                {...register("password", {
                                    required:
                                        "Password does not meet minimum length requirement (8)",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "Password does not meet minimum length requirement (8)",
                                    },
                                })}
                            />
                            <InputError>{errors.password?.message}</InputError>
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
                </form>
            </BoxGroupSection>
        </BoxGroup>
    );
}
