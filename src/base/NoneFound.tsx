import React from "react";
import { cn } from "@/app/utils";
import Icon from "./Icon";
import { noneFoundStyle } from "./noneFoundStyle";

/**
 * A ListGroupItem component with a 'none found'-type message. Used in ListGroups when no data is available to populate
 * the list. For example, when no sample have been created.
 *
 * @param noun {string} the name of the items of which none were found (eg. samples)
 * @param noListGroup {boolean} don't include a ListGroup in the returned element
 */
interface NoneFoundProps {
    noun: string;
    className?: string;
}

export default function NoneFound({ noun, className }: NoneFoundProps) {
    return (
        <div className={cn(noneFoundStyle, className)}>
            <Icon name="info-circle" /> No {noun} found
        </div>
    );
}
