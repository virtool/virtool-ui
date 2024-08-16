import { BoxGroupSection } from "@base";
import { byteSize, cn } from "@utils/utils.js";
import React from "react";

export function File({ file: { download_url, name, size } }) {
    return (
        <BoxGroupSection className={cn("items-center", "flex")}>
            <a className={cn("mr-auto", "font-medium")} href={`/api${download_url}`}>
                {name}
            </a>
            <strong>{byteSize(size)}</strong>
        </BoxGroupSection>
    );
}
