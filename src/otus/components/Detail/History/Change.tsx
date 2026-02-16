import Attribution from "@base/Attribution";
import BoxGroupSection from "@base/BoxGroupSection";
import Icon from "@base/Icon";
import IconButton from "@base/IconButton";
import Label from "@base/Label";
import { useRevertOTU } from "@otus/queries";
import { OtuNested } from "@otus/types";
import { UserNested } from "@users/types";
import {
    AlertTriangle,
    ArrowUpCircle,
    Copy,
    Dna,
    FileUp,
    FlaskConical,
    History,
    Link,
    Pencil,
    PlusSquare,
    Star,
    Trash,
} from "lucide-react";
import styled from "styled-components";

const methodIconProps = {
    add_isolate: {
        icon: FlaskConical,
        color: "blue",
    },
    create: {
        icon: PlusSquare,
        color: "blue",
    },
    create_sequence: {
        icon: Dna,
        color: "blue",
    },
    edit: {
        icon: Pencil,
        color: "orange",
    },
    edit_isolate: {
        icon: FlaskConical,
        color: "orange",
    },
    edit_sequence: {
        icon: Dna,
        color: "orange",
    },
    clone: {
        icon: Copy,
        color: "blue",
    },
    import: {
        icon: FileUp,
        color: "blue",
    },
    remote: {
        icon: Link,
        color: "blue",
    },
    remove: {
        icon: Trash,
        color: "red",
    },
    remove_isolate: {
        icon: FlaskConical,
        color: "red",
    },
    remove_sequence: {
        icon: Dna,
        color: "red",
    },
    set_as_default: {
        icon: Star,
        color: "orange",
    },
    update: {
        icon: ArrowUpCircle,
        color: "orange",
    },
};

function getMethodIcon(methodName: string) {
    const props = methodIconProps[methodName] ?? {
        icon: AlertTriangle,
        color: "red",
    };

    return <Icon {...props} />;
}

const StyledChange = styled(BoxGroupSection)`
    align-items: center;
    display: grid;
    grid-template-columns: 42px 2fr 1fr 15px;

    div:first-child {
        min-width: 42px;
    }
`;

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
    otu: OtuNested;
    unbuilt: boolean;
    user: UserNested;
};

/**
 * A condensed change item for use in a list of changes
 */
export default function Change({
    id,
    createdAt,
    description,
    methodName,
    otu,
    unbuilt,
    user,
}: ChangeProps) {
    const mutation = useRevertOTU(otu.id);

    return (
        <StyledChange>
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
                    IconComponent={History}
                    tip="revert"
                    onClick={() =>
                        unbuilt ? mutation.mutate({ changeId: id }) : null
                    }
                />
            )}
        </StyledChange>
    );
}
