import { Attribution, BoxGroupSection, Icon, Label } from "@base";
import { IconButton } from "@base/IconButton";
import { useRevertOTU } from "@otus/queries";
import { OTUNested } from "@otus/types";
import { UserNested } from "@users/types";
import { cn } from "@utils/utils";
import { get } from "lodash-es";
import React from "react";
import styled from "styled-components";

const methodIconProps = {
    add_isolate: {
        name: "flask",
        color: "blue",
    },
    create: {
        name: "plus-square",
        color: "blue",
    },
    create_sequence: {
        name: "dna",
        color: "blue",
    },
    edit: {
        name: "pencil-alt",
        color: "orange",
    },
    edit_isolate: {
        name: "flask",
        color: "orange",
    },
    edit_sequence: {
        name: "dna",
        color: "orange",
    },
    clone: {
        name: "clone",
        color: "blue",
    },
    import: {
        name: "file-import",
        color: "blue",
    },
    remote: {
        name: "link",
        color: "blue",
    },
    remove: {
        name: "trash",
        color: "red",
    },
    remove_isolate: {
        name: "flask",
        color: "red",
    },
    remove_sequence: {
        name: "dna",
        color: "red",
    },
    set_as_default: {
        name: "star",
        color: "orange",
    },
    update: {
        name: "arrow-alt-circle-up",
        color: "orange",
    },
};

function getMethodIcon(methodName: string) {
    const props = get(methodIconProps, methodName, {
        name: "exclamation-triangle",
        color: "red",
    });

    return <Icon {...props} />;
}

const Description = styled.div`
    align-items: center;
    display: flex;

    i {
        margin-right: 5px;
    }
`;

type ChangeProps = {
    id: string;
    createdAt: string;
    description: string;
    methodName: string;
    otu: OTUNested;
    unbuilt: boolean;
    user: UserNested;
};

/**
 * A condensed change item for use in a list of changes
 */
export default function Change({ id, createdAt, description, methodName, otu, unbuilt, user }: ChangeProps) {
    const mutation = useRevertOTU(otu.id);

    return (
        <BoxGroupSection className={cn("items-center", "grid", "grid-cols-[42px_2fr_1fr_15px]")}>
            <div>
                <Label>{otu.version}</Label>
            </div>

            <Description>
                {getMethodIcon(methodName)}
                <span>{description || "No Description"}</span>
            </Description>

            <Attribution time={createdAt} user={user.handle} verb="" />

            {unbuilt && (
                <IconButton
                    name="history"
                    tip="revert"
                    onClick={() => (unbuilt ? mutation.mutate({ changeId: id }) : null)}
                />
            )}
        </BoxGroupSection>
    );
}
