import { ReactNode } from "react";

export class Settings {
    default_source_types: string[];
    enable_api: boolean;
    enable_sentry: boolean;
    hmm_slug: string;
    minimum_password_length: number;
    sample_all_read: boolean;
    sample_all_write: boolean;
    sample_group: string;
    sample_group_read: boolean;
    sample_group_write: boolean;
    sample_unique_names: boolean;
}

export type virtoolState = {
    b2c: B2CSettings;
    sentryDsn: string;
};

export type B2CSettings = {
    apiClientId: string;
    clientId: string;
    enabled: boolean;
    tenant: string;
    userFlow: string;
    version: string;
};

export type Task = {
    complete: boolean;
    created_at: Date;
    error: string | null;
    id: number;
    progress: number;
    step: string;
    type: string;
};

export type OnlyChildrenProps = {
    children: ReactNode;
};
