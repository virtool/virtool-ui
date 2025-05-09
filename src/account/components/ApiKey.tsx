import Attribution from "@base/Attribution";
import BoxGroupSection from "@base/BoxGroupSection";
import IconButton from "@base/IconButton";
import { reduce } from "lodash-es";
import React from "react";
import { useRemoveAPIKey } from "../queries";
import { APIKeyMinimal } from "../types";
import ApiKeyEdit from "./ApiKeyEdit";

type ApiKeyProps = {
    apiKey: APIKeyMinimal;
};

/**
 * Display a condensed API key for use in a list of API keys
 */
export default function ApiKey({ apiKey }: ApiKeyProps) {
    const permissionCount = reduce(
        apiKey.permissions,
        (result, value) => result + (value ? 1 : 0),
        0,
    );

    const removeMutation = useRemoveAPIKey();

    return (
        <BoxGroupSection>
            <h4 className="grid items-center grid-cols-4">
                <span className="font-medium text-lg">{apiKey.name}</span>
                <Attribution time={apiKey.created_at} />
                <div className="text-right">
                    {permissionCount} permission
                    {permissionCount === 1 ? null : "s"}
                </div>
                <div className="flex justify-end">
                    <ApiKeyEdit
                        id={apiKey.id}
                        permissions={apiKey.permissions}
                    />
                    <IconButton
                        color="red"
                        name="trash"
                        onClick={() =>
                            removeMutation.mutate({ keyId: apiKey.id })
                        }
                        tip="Delete"
                    />
                </div>
            </h4>
        </BoxGroupSection>
    );
}
