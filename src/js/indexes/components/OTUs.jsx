import { map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Badge, BoxGroup, BoxGroupHeader } from "../../base";
import { IndexOTU } from "./OTU";

export function IndexOTUs({ otus, refId }) {
    const otuComponents = map(otus, otu => (
        <IndexOTU
            key={otu.id}
            refId={refId}
            name={otu.name}
            id={otu.id}
            changeCount={otu.change_count}
        />
    ));

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>
                    OTUs <Badge>{otus.length}</Badge>
                </h2>
            </BoxGroupHeader>
            {otuComponents}
        </BoxGroup>
    );
}

export function mapStateToProps(state) {
    return {
        refId: state.indexes.detail.reference.id,
        otus: state.indexes.detail.otus,
    };
}

export default connect(mapStateToProps)(IndexOTUs);
