import { Combobox, InitialIcon } from "@base";
import { User } from "@users/types";
import { cn } from "@utils/utils";
import React from "react";

function renderRow(user: User) {
    return (
        <div
            className={cn("text-base", "font-medium", "flex", "items-center", "relative", "select-none", "capitalize")}
            aria-label={user.handle}
            key={user.id}
        >
            <InitialIcon handle={user.handle} size="md" />
            <span className={cn("ml-2")}>{user.handle}</span>
        </div>
    );
}

type UserSelectProps = {
    id: string;
    onChange: (value: string) => void;
    users: User[];
    value: User;
};

export function UserSelect({ id, onChange, users, value }: UserSelectProps) {
    return <Combobox id={id} items={users} onChange={onChange} renderRow={renderRow} selectedItem={value || null} />;
}
