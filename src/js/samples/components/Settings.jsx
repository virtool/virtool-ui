import React from "react";
import { connect } from "react-redux";
import SampleRights from "../../administration/components/SampleRights";
import { mapSettingsStateToProps } from "../../administration/mappers";
import { LoadingPlaceholder, NarrowContainer, ViewHeader, ViewHeaderTitle } from "../../base";

export const SamplesSettings = ({ loading }) => {
    if (loading) {
        return <LoadingPlaceholder />;
    }

    return (
        <NarrowContainer>
            <ViewHeader title="Sample Settings">
                <ViewHeaderTitle>Sample Settings</ViewHeaderTitle>
            </ViewHeader>
            <SampleRights />
        </NarrowContainer>
    );
};

export default connect(mapSettingsStateToProps)(SamplesSettings);
