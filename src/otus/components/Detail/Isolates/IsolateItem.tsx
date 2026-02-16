import { useUrlSearchParam } from "@app/hooks";
import { getActiveShadow } from "@app/theme";
import { formatIsolateName } from "@app/utils";
import BoxGroupSection from "@base/BoxGroupSection";
import Icon from "@base/Icon";
import { OtuIsolate } from "@otus/types";
import { Star } from "lucide-react";
import styled from "styled-components";

const StyledIsolateItem = styled(BoxGroupSection)`
    align-items: center;
    border: none;
    box-shadow: ${getActiveShadow};
    display: flex;

    & > span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    i.fas {
        margin-left: auto;
    }
`;

type IsolateItemProps = {
    /** Whether the Isolate is selected */
    active: boolean;
    isolate: OtuIsolate;
};

/**
 * A condensed isolate item for use in a list of isolates
 */
export default function IsolateItem({ active, isolate }: IsolateItemProps) {
    const { setValue: setActiveIsolate } =
        useUrlSearchParam<string>("activeIsolate");

    return (
        <StyledIsolateItem
            active={active}
            onClick={() => setActiveIsolate(isolate.id)}
        >
            <span>{formatIsolateName(isolate)}</span>
            {isolate.default && <Icon icon={Star} />}
        </StyledIsolateItem>
    );
}
