import { UserNested } from "@users/types";

export type Message = {
    active: boolean;
    color: string;
    created_at: string;
    id: number;
    message: string;
    updated_at: string;
    user: UserNested;
};
