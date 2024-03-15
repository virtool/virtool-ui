import { BoxGroup, Button, LoadingPlaceholder, NoneFoundBox } from "@/base";
import EditSegment from "@otus/components/Detail/Schema/EditSegment";
import { useFetchOTU } from "@otus/queries";
import { ReferenceRight, useCheckReferenceRight } from "@references/hooks";
import { map, sortBy } from "lodash-es";
import React from "react";
import { match, useHistory } from "react-router-dom";
import styled from "styled-components";
import AddSegment from "./AddSegment";
import RemoveSegment from "./RemoveSegment";
import Segment from "./Segment";

const AddButton = styled(Button)`
    margin-bottom: 10px;
    width: 100%;
`;

type SchemaProps = {
    /** Match object containing path information */
    match: match<{ otuId: string; refId: string }>;
};

/**
 * Displays a component allowing users to manage the otu schema
 */
export default function Schema({ match }: SchemaProps) {
    const { refId, otuId } = match.params;
    const { hasPermission: canModify } = useCheckReferenceRight(refId, ReferenceRight.modify_otu);
    const history = useHistory();

    const { data, isLoading } = useFetchOTU(otuId);

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const { abbreviation, name, schema } = data;

    return (
        <div>
            {canModify && (
                <AddButton
                    color="blue"
                    icon="plus-square"
                    onClick={() => history.push({ state: { addSegment: true } })}
                >
                    Add Segment
                </AddButton>
            )}
            {schema.length ? (
                <BoxGroup>
                    {map(sortBy(schema, [segment => segment.name.toLowerCase()]), segment => (
                        <Segment canModify={canModify} segment={segment} />
                    ))}
                </BoxGroup>
            ) : (
                <NoneFoundBox noun="segments" />
            )}

            <AddSegment abbreviation={abbreviation} name={name} otuId={otuId} schema={schema} />
            <EditSegment abbreviation={abbreviation} name={name} otuId={otuId} schema={schema} />
            {schema.length ? (
                <RemoveSegment abbreviation={abbreviation} name={name} otuId={otuId} schema={schema} />
            ) : null}
        </div>
    );
}
