import { GroupMinimal, Permissions } from "@groups/types";
import { User } from "@users/types";

export enum QuickAnalyzeWorkflow {
    aodp = "aodp",
    nuvs = "nuvs",
    pathoscope_bowtie = "pathoscope_bowtie",
}

export type APIKeyMinimal = {
    created_at?: string;
    groups: Array<GroupMinimal>;
    id: string;
    key?: string;
    name: string;
    permissions: Permissions;
};

export type AccountSettings = {
    quick_analyze_workflow: QuickAnalyzeWorkflow;
    show_ids: boolean;
    show_versions: boolean;
    skip_quick_analyze_dialog: boolean;
};

export type Account = User & {
    settings: AccountSettings;
    email?: string;
};
