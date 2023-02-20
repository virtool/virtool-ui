import React from "react";
import styled from "styled-components/macro";
import { Icon } from "./Icon";
import { noneFoundStyle } from "./noneFoundStyle";

/**
 * A ListGroupItem component with a 'none found'-type message. Used in ListGroups when no data is available to populate
 * the list. For example, when no sample have been created.
 *
 * @param noun {string} the name of the items of which none were found (eg. samples)
 * @param noListGroup {boolean} don't include a ListGroup in the returned element
 */
const StyledNoneFound = styled.div`
    ${noneFoundStyle}

    i.fas {
        margin-right: 5px;
    }
`;

interface NoneFoundProps {
    noun: string;
}

export const NoneFound = ({ noun }: NoneFoundProps) => {
    return (
        <StyledNoneFound>
            <Icon name="info-circle" /> No {noun} found
        </StyledNoneFound>
    );
};
