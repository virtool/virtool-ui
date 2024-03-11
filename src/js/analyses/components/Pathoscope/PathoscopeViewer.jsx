import { PathoscopeViewerScroller } from "@/analyses/components/Pathoscope/PathoscopeViewScroller";
import React from "react";
import Mapping from "./Mapping";
import PathoscopeList from "./PathoscopeList";
import PathoscopeToolbar from "./Toolbar";

/** Detailed breakdown of the results of a pathoscope analysis */
export function PathoscopeViewer() {
    return (
        <>
            <Mapping />
            <PathoscopeToolbar />
            <PathoscopeList />
            <PathoscopeViewerScroller />
        </>
    );
}
