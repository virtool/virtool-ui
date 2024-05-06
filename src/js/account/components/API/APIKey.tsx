import { useRemoveAPIKey, useUpdateAPIKey } from "@account/queries";
import { Attribution, BoxGroupSection, Button, ButtonToolbar, Icon } from "@base";
import { Permissions } from "@groups/types";
import { isEqual, reduce } from "lodash-es";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import APIPermissions from "./APIPermissions";

const APIKeyCloseContainer = styled.div`
    text-align: right;
`;

const APIKeyHeader = styled.div`
    display: grid;
    grid-template-columns: 3fr 2fr 1fr 1fr;
`;

const APIKeyPermissionCount = styled.div`
    text-align: right;
`;

const APIKeyPermissions = styled(APIPermissions)`
    margin-top: 15px;
`;

type FormValues = {
    name: string;
    permissions: Permissions;
};

export default function APIKey({ apiKey }) {
    const [show, setShow] = useState(false);
    const updateMutation = useUpdateAPIKey();
    const removeMutation = useRemoveAPIKey();
    const { handleSubmit, control, watch } = useForm<FormValues>({
        defaultValues: {
            permissions: apiKey.permissions,
        },
    });

    const permissionCount = reduce(apiKey.permissions, (result, value) => result + (value ? 1 : 0), 0);

    function onSubmit({ permissions }) {
        updateMutation.mutate({ keyId: apiKey.id, permissions });
    }

    return (
        <BoxGroupSection key={apiKey.id} onClick={show ? null : () => setShow(!show)}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <APIKeyHeader>
                    <strong>{apiKey.name}</strong>
                    <Attribution time={apiKey.created_at} />
                    <APIKeyPermissionCount>
                        {permissionCount} permission{permissionCount === 1 ? null : "s"}
                    </APIKeyPermissionCount>
                    <APIKeyCloseContainer>
                        {show && <Icon name="times" aria-label="close" onClick={() => setShow(!show)} />}
                    </APIKeyCloseContainer>
                </APIKeyHeader>
                {show && (
                    <div>
                        <Controller
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <APIKeyPermissions keyPermissions={value} onChange={onChange} />
                            )}
                            name="permissions"
                        />

                        <ButtonToolbar>
                            <Button
                                color="red"
                                icon="trash"
                                onClick={() => removeMutation.mutate({ keyId: apiKey.id })}
                            >
                                Remove
                            </Button>
                            <Button
                                type="submit"
                                color="blue"
                                icon="save"
                                disabled={isEqual(watch("permissions"), apiKey.permissions)}
                            >
                                Update
                            </Button>
                        </ButtonToolbar>
                    </div>
                )}
            </form>
        </BoxGroupSection>
    );
}
