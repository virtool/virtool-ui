import React from "react";
import styled from "styled-components";
import { BoxSpaced, device } from "../../../base";
import { ReferenceMinimal } from "../../types";
import { ReferenceItemBuild } from "./Build";
import { ReferenceItemHeader } from "./Header";
import { ReferenceItemOrigin } from "./Origin";
import { ReferenceItemProgress } from "./Progress";

const ReferenceItemBody = styled.div`
    align-items: stretch;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: ${props => props.theme.gap.column};
    margin-bottom: 5px;
    padding: 0 15px 5px;

    @media (min-width: ${device.desktop}) {
        grid-template-columns: 1fr 1fr;
    }
`;

const StyledReferenceItem = styled(BoxSpaced)`
    padding: 0 0 10px;
    margin-bottom: 15px;
`;

export default function ReferenceItem({ reference }: { reference: ReferenceMinimal }) {
    const {
        id,
        data_type,
        name,
        organism,
        otu_count,
        user,
        cloned_from,
        imported_from,
        remotes_from,
        latest_build,
        task,
        created_at,
    } = reference;
    return (
        <StyledReferenceItem>
            <ReferenceItemHeader
                id={id}
                createdAt={created_at}
                dataType={data_type}
                name={name}
                organism={organism}
                otuCount={otu_count}
                userHandle={user.handle}
            />
            <ReferenceItemBody>
                <ReferenceItemOrigin clonedFrom={cloned_from} importedFrom={imported_from} remotesFrom={remotes_from} />
                <ReferenceItemBuild id={id} latestBuild={latest_build} progress={task?.progress} />
            </ReferenceItemBody>
            <ReferenceItemProgress now={task?.progress} />
        </StyledReferenceItem>
    );
}
