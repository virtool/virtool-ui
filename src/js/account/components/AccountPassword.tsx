import { useChangePassword } from "@account/queries";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import InputContainer from "@base/InputContainer";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputPassword from "@base/InputPassword";
import RelativeTime from "@base/RelativeTime";
import SaveButton from "@base/SaveButton";
import React from "react";
import { useForm } from "react-hook-form";

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
export default function AccountPassword({
    lastPasswordChange,
}: ChangePasswordProps) {
    const {
        formState: { errors },
        handleSubmit,
        register,
    } = useForm<FormValues>({
        defaultValues: { oldPassword: "", newPassword: "" },
    });
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
                        <InputLabel htmlFor="oldPassword">
                            Old Password
                        </InputLabel>
                        <InputContainer>
                            <InputPassword
                                id="oldPassword"
                                {...register("oldPassword", {
                                    required:
                                        "Please provide your old password",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "Password does not meet minimum length requirement (8)",
                                    },
                                })}
                            />
                            <InputError>
                                {errors.oldPassword?.message ||
                                    (mutation.isError &&
                                        mutation.error.response.body?.message)}
                            </InputError>
                        </InputContainer>
                    </InputGroup>
                    <InputGroup>
                        <InputLabel htmlFor="newPassword">
                            New Password
                        </InputLabel>
                        <InputContainer>
                            <InputPassword
                                id="newPassword"
                                {...register("newPassword", {
                                    required: "Please provide a new password",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "Password does not meet minimum length requirement (8)",
                                    },
                                })}
                            />
                            <InputError>
                                {errors.newPassword?.message}
                            </InputError>
                        </InputContainer>
                    </InputGroup>
                    <div className="flex items-center justify-between mb-4">
                        <span>
                            Last changed{" "}
                            <RelativeTime time={lastPasswordChange} />
                        </span>
                        <SaveButton altText="Change" />
                    </div>
                </BoxGroupSection>
            </form>
        </BoxGroup>
    );
}
