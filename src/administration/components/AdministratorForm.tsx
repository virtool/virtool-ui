import {
    useFindUsers,
    useGetAdministratorRoles,
    useSetAdministratorRole,
} from "@administration/queries";
import { AdministratorRoleName } from "@administration/types";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import SaveButton from "@base/SaveButton";
import { User } from "@users/types";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import AdministratorRoleSelect from "./AdministratorRoleSelect";
import AdministratorUserSelect from "./AdministratorUserSelect";

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

type FormInputValues = {
    role: AdministratorRoleName;
    user: User;
};

type AdministratorFormProps = {
    onClose: () => void;
};

export default function AdministratorForm({
    onClose,
}: AdministratorFormProps): JSX.Element {
    const {
        formState: { errors },
        handleSubmit,
        control,
    } = useForm<FormInputValues>();

    const [userSearchTerm, setUserSearchTerm] = React.useState("");

    const { data: users } = useFindUsers(1, 25, userSearchTerm, false);
    const { data: roles } = useGetAdministratorRoles();

    const mutator = useSetAdministratorRole();

    function onSubmit({ user, role }: FormInputValues) {
        mutator.mutate({ user_id: user.id, role });
        onClose();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <InputGroup>
                <InputLabel htmlFor="user">User</InputLabel>
                <UserSelectContainer>
                    <Controller
                        render={({ field: { onChange, value } }) => (
                            <AdministratorUserSelect
                                onChange={onChange}
                                value={value}
                                users={users?.items || []}
                                onTermChange={setUserSearchTerm}
                                term={userSearchTerm}
                                id="user"
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
                            <AdministratorRoleSelect
                                onChange={onChange}
                                value={value}
                                roles={roles || []}
                                id="role"
                            />
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
