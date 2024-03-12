import { PathoscopeViewerScroller } from "@/analyses/components/Pathoscope/PathoscopeViewScroller";
import React from "react";
import Mapping from "./Mapping";
import PathoscopeList from "./PathoscopeList";
import PathoscopeToolbar from "./PathoscopeToolbar";

/** Detailed breakdown of the results of a pathoscope analysis */
export function PathoscopeViewer({ detail }) {
    return (
        <>
            <Mapping />
            <PathoscopeToolbar />
            <PathoscopeList detail={detail} />
            <PathoscopeViewerScroller />
        </>
    );
}
