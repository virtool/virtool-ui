import { filter, map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { ScrollSync } from "react-scroll-sync";
import { PathoscopeIsolate } from "./Isolate";

export const PathoscopeDetail = ({ filterIsolates, hit, mappedReads, showPathoscopeReads, onRendered }) => {
    const { isolates, pi } = hit;

    const filtered = filter(isolates, isolate => filterIsolates === false || isolate.pi >= 0.03 * pi);

    const isolateComponents = map(filtered, isolate => (
        <PathoscopeIsolate
            key={isolate.id}
            {...isolate}
            reads={Math.round(isolate.pi * mappedReads)}
            showPathoscopeReads={showPathoscopeReads}
        />
    ));

    return (
        <div>
            <ScrollSync>
                <div>{isolateComponents}</div>
            </ScrollSync>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        filterIsolates: state.analyses.filterIsolates,
        mappedReads: state.analyses.detail.read_count,
        showPathoscopeReads: state.analyses.showPathoscopeReads,
    };
}

export default connect(mapStateToProps)(PathoscopeDetail);
