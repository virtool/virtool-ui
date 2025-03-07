import { useRemoveAPIKey, useUpdateAPIKey } from "@account/queries";
import { APIKeyMinimal } from "@account/types";
import Attribution from "@base/Attribution";
import BoxGroupSection from "@base/BoxGroupSection";
import Button from "@base/Button";
import IconButton from "@base/IconButton";
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

type APIKeyProps = {
    apiKey: APIKeyMinimal;
};

/**
 * Display a condensed API key for use in a list of API keys
 */
export default function APIKey({ apiKey }: APIKeyProps) {
    const [show, setShow] = useState(false);
    const updateMutation = useUpdateAPIKey();
    const removeMutation = useRemoveAPIKey();
    const { handleSubmit, control, watch } = useForm<FormValues>({
        defaultValues: {
            permissions: apiKey.permissions,
        },
    });

    const permissionCount = reduce(
        apiKey.permissions,
        (result, value) => result + (value ? 1 : 0),
        0,
    );

    function onSubmit({ permissions }) {
        updateMutation.mutate({ keyId: apiKey.id, permissions });
    }

    return (
        <BoxGroupSection
            key={apiKey.id}
            onClick={show ? null : () => setShow(!show)}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <APIKeyHeader>
                    <strong>{apiKey.name}</strong>
                    <Attribution time={apiKey.created_at} />
                    <APIKeyPermissionCount>
                        {permissionCount} permission
                        {permissionCount === 1 ? null : "s"}
                    </APIKeyPermissionCount>
                    <APIKeyCloseContainer>
                        {show && (
                            <IconButton
                                name="times"
                                tip="close"
                                onClick={() => setShow(!show)}
                            />
                        )}
                    </APIKeyCloseContainer>
                </APIKeyHeader>
                {show && (
                    <div>
                        <Controller
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <APIKeyPermissions
                                    keyPermissions={value}
                                    onChange={onChange}
                                />
                            )}
                            name="permissions"
                        />

                        <div className="flex items-center justify-end mb-2.5 gap-1.5">
                            <Button
                                color="red"
                                onClick={() =>
                                    removeMutation.mutate({ keyId: apiKey.id })
                                }
                            >
                                Delete
                            </Button>
                            <Button
                                color="blue"
                                disabled={isEqual(
                                    watch("permissions"),
                                    apiKey.permissions,
                                )}
                                type="submit"
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </BoxGroupSection>
    );
}
