import React from "react";
import { connect } from "react-redux";
import { BoxGroup, BoxGroupHeader, BoxGroupSection } from "../../base";
import { Quality } from "../../quality/components/Quality";

export const CacheQuality = props => (
    <BoxGroup>
        <BoxGroupHeader>Quality</BoxGroupHeader>
        <BoxGroupSection>
            <Quality {...props} />
        </BoxGroupSection>
    </BoxGroup>
);

export const mapStateToProps = state => {
    const { bases, composition, sequences } = state.caches.detail.quality;
    return { bases, composition, sequences };
};

export default connect(mapStateToProps)(CacheQuality);
