import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../../app/theme";
import { Attribution, BoxGroupSection, Icon, IconLink } from "../../../base";
import { ProgressCircle } from "../../../base/ProgressCircle";
import { ReferenceMinimal } from "../../types";

const StyledReferenceItem = styled(BoxGroupSection)`
    align-items: center;
    display: flex;
    padding-bottom: 15px;
    padding-top: 15px;

    i {
        margin-right: 4px;
    }
`;

const ReferenceLink = styled(Link)`
    min-width: 30%;
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
`;

const ReferenceItemDataDescriptor = styled.strong`
    text-transform: capitalize;
`;

const ReferenceJobItemRight = styled.div`
    align-items: center;
    display: flex;
    gap: 5px;
    margin-left: auto;
`;

const LargeIconLink = styled.div`
    font-size: ${getFontSize("lg")};
`;

type ReferenceItemProps = {
    reference: ReferenceMinimal;
};

/**
 * A condensed reference item for use in a list of references
 */
export function ReferenceItem({ reference }: ReferenceItemProps) {
    const { id, data_type, name, organism, user, created_at, task } = reference;

    return (
        <StyledReferenceItem>
            <ReferenceLink to={`/refs/${id}`}>{name}</ReferenceLink>
            <Icon name={data_type === "genome" ? "dna" : "barcode"} />
            <ReferenceItemDataDescriptor>
                {organism || "unknown"} {data_type || "genome"}s
            </ReferenceItemDataDescriptor>
            <ReferenceJobItemRight>
                <Attribution time={created_at} user={user.handle} />
                {task.complete ? (
                    <LargeIconLink>
                        <IconLink
                            to={{ state: { cloneReference: true, id } }}
                            name="clone"
                            tip="Clone"
                            color="blue"
                            aria-label="clone"
                        />
                    </LargeIconLink>
                ) : (
                    <ProgressCircle progress={task?.progress || 0} state={task.complete ? "complete" : "running"} />
                )}
            </ReferenceJobItemRight>
        </StyledReferenceItem>
    );
}
