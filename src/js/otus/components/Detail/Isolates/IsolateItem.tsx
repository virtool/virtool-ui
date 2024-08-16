import { BoxGroupSection, Icon } from "@/base";
import { OTUIsolate } from "@otus/types";
import { ReferenceDataType } from "@references/types";
import { useLocationState } from "@utils/hooks";
import { cn, formatIsolateName } from "@utils/utils";
import { merge } from "lodash";
import React from "react";

type IsolateItemProps = {
    /** Whether the Isolate is selected */
    active: boolean;
    dataType: ReferenceDataType;
    isolate: OTUIsolate;
};

/**
 * A condensed isolate item for use in a list of isolates
 */
export default function IsolateItem({ active, dataType, isolate }: IsolateItemProps) {
    const [locationState, setLocationState] = useLocationState();

    return (
        <BoxGroupSection
            className={cn("items-center", "flex", {
                "shadow-[inset_3px_0_0] shadow-teal-700": active,
            })}
            active={active}
            onClick={() => setLocationState(merge(locationState, { activeIsolateId: isolate.id }))}
        >
            <span className={cn("overflow-hidden", "text-ellipsis", "whitespace-nowrap")}>
                {formatIsolateName(isolate)}
            </span>
            {isolate.default && dataType !== "barcode" && <Icon className={cn("ml-auto")} name="star" />}
        </BoxGroupSection>
    );
}
