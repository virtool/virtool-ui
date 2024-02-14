import { UserNested } from "../users/types";

export enum HistoryMethod {
    add_isolate = "add_isolate",
    create = "create",
    create_sequence = "create_sequence",
    clone = "clone",
    edit = "edit",
    edit_sequence = "edit_sequence",
    edit_isolate = "edit_isolate",
    remove = "remove",
    remote = "remote",
    remove_isolate = "remove_isolate",
    remove_sequence = "remove_sequence",
    import_otu = "import",
    set_as_default = "set_as_default",
    update = "update",
}

/** Contains search results information */
export type SearchResult = {
    /** The number of items found */
    found_count: number;
    /** The current page number */
    page: number;
    /** The total number of pages */
    page_count: number;
    /** The number of items per page */
    per_page: number;
    /** The total number of items */
    total_count: number;
};

/** Contains information on history change */
export type HistoryNested = {
    /** When the change was made */
    created_at: string;
    /** A human readable description for the change */
    description: string;
    /** The unique ID for the change */
    id: string;
    /** The name of the method that made the change (eg. edit_sequence) */
    method_name: HistoryMethod;
    /** Identifying information for the user that made the change */
    user: UserNested;
};
