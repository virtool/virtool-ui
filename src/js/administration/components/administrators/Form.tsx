import React from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { InputError, InputGroup, InputLabel, LoadingPlaceholder, SaveButton } from "../../../base";
import { User } from "../../../users/types";
import { useGetUsers, useSetAdministratorRole } from "../../querys";
import { AdministratorRole, AdministratorRoles } from "../../types";
import { RoleSelect } from "./RoleSelect";
import { UserSelect } from "./UserSelect";

const RoleSelectContainer = styled.div`
    display: flex;
    flex-direction: column;

    button {
        flex-grow: 1;
        padding: 10px 10px;
    }
`;

const UserSelectContainer = styled.div`
    display: flex;
    flex-direction: column;
    button {
        flex-grow: 1;
        padding: 10px 10px;
    }
`;

interface FormInputValues {
    user: User;
    role: AdministratorRoles;
}

type AdministratorFormProps = {
    roles: Array<AdministratorRole>;
    onClose: Function;
};

export function AdministratorForm({ roles, onClose }: AdministratorFormProps): JSX.Element {
    const {
        formState: { errors },
        handleSubmit,
        control
    } = useForm<FormInputValues>();

    const [userSearchTerm, setUserSearchTerm] = React.useState("");

    const { data: users, isLoading } = useGetUsers(1, 25, userSearchTerm, false);

    const administratorRoleMutator = useSetAdministratorRole();
    const onSubmit = ({ user, role }: FormInputValues) => {
        administratorRoleMutator.mutate({ user_id: user.id, role });
        onClose();
    };

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <InputGroup>
                <InputLabel htmlFor="name">Name</InputLabel>
                <UserSelectContainer>
                    <Controller
                        render={({ field: { onChange, value } }) => (
                            <UserSelect
                                onChange={onChange}
                                value={value}
                                users={users.items}
                                onTermChange={setUserSearchTerm}
                                term={userSearchTerm}
                            />
                        )}
                        name="user"
                        control={control}
                        rules={{ required: "A user must be selected" }}
                    />
                </UserSelectContainer>
                <InputError>{errors.user?.message}</InputError>
            </InputGroup>
            <InputGroup>
                <InputLabel htmlFor="role">Role</InputLabel>
                <RoleSelectContainer>
                    <Controller
                        render={({ field: { onChange, value } }) => (
                            <RoleSelect onChange={onChange} value={value} roles={roles} />
                        )}
                        name="role"
                        control={control}
                        rules={{ required: "A role must be selected" }}
                    />
                    <InputError>{errors.role?.message}</InputError>
                </RoleSelectContainer>
            </InputGroup>
            <SaveButton />
        </form>
    );
}
