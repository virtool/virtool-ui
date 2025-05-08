import BoxGroup from "@base/BoxGroup";
import ExternalLink from "@base/ExternalLink";
import Link from "@base/Link";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import { map } from "lodash-es";
import React from "react";
import { cn } from "../../app/utils";
import { useFetchAPIKeys } from "../queries";
import ApiKey from "./ApiKey";
import ApiKeyCreate from "./ApiKeyCreate";

/**
 * A component to manage and display API keys
 */
export default function ApiKeys() {
    const { data, isPending } = useFetchAPIKeys();

    if (isPending) {
        return <LoadingPlaceholder className="mt-36" />;
    }

    const keyComponents =
        data.length && map(data, (key) => <ApiKey key={key.id} apiKey={key} />);

    return (
        <div>
            <header
                className={cn(
                    "flex",
                    "font-medium",
                    "items-center",
                    "justify-between",
                    "mb-4",
                    "text-lg",
                )}
            >
                <h3>
                    Manage API keys for accessing the{" "}
                    <ExternalLink href="https://www.virtool.ca/docs/developer/api_account/">
                        Virtool API
                    </ExternalLink>
                    .
                </h3>
                <Link to="?openCreateKey=true" replace>
                    Create
                </Link>
            </header>

            {keyComponents.length ? (
                <BoxGroup>{keyComponents}</BoxGroup>
            ) : (
                <NoneFoundBox noun="API keys" />
            )}

            <ApiKeyCreate />
        </div>
    );
}
