import { Accordion } from "@base/accordion/Accordion";
import { map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { setActiveHitId } from "../../actions";
import { getMatches } from "../../selectors";
import PathoscopeItem from "./PathoscopeItem";
/** A list of pathoscope hits*/
export const PathoscopeList = ({ matches }) => {
    return (
        <Accordion type="single" collapsible>
            {map(matches, (match, index) => (
                <PathoscopeItem key={match.id} index={index} {...match} />
            ))}
        </Accordion>
    );
};

export function mapStateToProps(state) {
    const matches = getMatches(state);

    return {
        matches,
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        onSetActiveId: index => {
            dispatch(setActiveHitId(index));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PathoscopeList);
