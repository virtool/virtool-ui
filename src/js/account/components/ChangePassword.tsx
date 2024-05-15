import { useChangePassword } from "@account/queries";
import {
    BoxGroup,
    BoxGroupHeader,
    BoxGroupSection,
    InputContainer,
    InputError,
    InputGroup,
    InputLabel,
    InputPassword,
    RelativeTime,
    SaveButton,
} from "@base";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

const ChangePasswordFooter = styled.div`
    align-items: start;
    display: flex;
    margin-top: 15px;

    > span {
        color: ${props => props.theme.color.greyDark};
    }

    button {
        margin-left: auto;
    }
`;

type FormValues = {
    oldPassword: string;
    newPassword: string;
};

type ChangePasswordProps = {
    /** The iso formatted date of the most recent password change */
    lastPasswordChange: string;
};

/**
 * A component to update the accounts password
 */
export default function ChangePassword({ lastPasswordChange }: ChangePasswordProps) {
    const {
        formState: { errors },
        handleSubmit,
        register,
    } = useForm<FormValues>({ defaultValues: { oldPassword: "", newPassword: "" } });
    const mutation = useChangePassword();

    function onSubmit({ oldPassword, newPassword }: FormValues) {
        mutation.mutate({ old_password: oldPassword, password: newPassword });
    }

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>Password</h2>
            </BoxGroupHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <BoxGroupSection>
                    <InputGroup>
                        <InputLabel htmlFor="oldPassword">Old Password</InputLabel>
                        <InputContainer>
                            <InputPassword
                                id="oldPassword"
                                {...register("oldPassword", {
                                    required: "Please provide your old password",
                                    minLength: {
                                        value: 8,
                                        message: "Password does not meet minimum length requirement (8)",
                                    },
                                })}
                            />
                            <InputError>
                                {errors.oldPassword?.message ||
                                    (mutation.isError && mutation.error.response.body?.message)}
                            </InputError>
                        </InputContainer>
                    </InputGroup>
                    <InputGroup>
                        <InputLabel htmlFor="newPassword">New Password</InputLabel>
                        <InputContainer>
                            <InputPassword
                                id="newPassword"
                                {...register("newPassword", {
                                    required: "Please provide a new password",
                                    minLength: {
                                        value: 8,
                                        message: "Password does not meet minimum length requirement (8)",
                                    },
                                })}
                            />
                            <InputError>{errors.newPassword?.message}</InputError>
                        </InputContainer>
                    </InputGroup>
                    <ChangePasswordFooter>
                        <span>
                            Last changed <RelativeTime time={lastPasswordChange} />
                        </span>
                        <SaveButton altText="Change" />
                    </ChangePasswordFooter>
                </BoxGroupSection>
            </form>
        </BoxGroup>
    );
}
