import { useFetchSettings } from "@administration/queries";
import { Container, LoadingPlaceholder } from "@base";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom-v5-compat";
import ReferenceDetail from "./Detail/ReferenceDetail";
import ReferenceList from "./ReferenceList";
import { ReferenceSettings } from "./ReferenceSettings";

/**
 * The references view with routes to reference-related components
 */
export default function References() {
    const { isPending } = useFetchSettings();

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    return (
        <Container>
            <Routes>
                <Route path="/" element={<ReferenceList />} />
                <Route path="/settings/*" element={<Navigate replace to="/refs/settings" />} />
                <Route path="/settings" element={<ReferenceSettings />} />
                <Route path="/:refId/*" element={<ReferenceDetail />} />
            </Routes>
        </Container>
    );
}
