import { RemoveDialog } from "@base/RemoveDialog";
import { useUpdateOTU } from "@otus/queries";
import { OTUSegment } from "@otus/types";
import { reject } from "lodash-es";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom-v5-compat";

type RemoveSegmentProps = {
    abbreviation: string;
    name: string;
    otuId: string;
    /** List of segments associated with the OTU */
    schema: OTUSegment[];
};

/**
 * Displays a dialog for removing a segment
 */
export default function RemoveSegment({ abbreviation, name, otuId, schema }: RemoveSegmentProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const mutation = useUpdateOTU(otuId);

    const activeName = location.state?.removeSegment;

    function handleSubmit() {
        mutation.mutate(
            { otuId, name, abbreviation, schema: reject(schema, { name: activeName }) },
            {
                onSuccess: () => {
                    navigate(".", { replace: true, state: { removeSegment: "" } });
                },
            }
        );
    }

    return (
        <RemoveDialog
            name={activeName}
            noun="Segment"
            onConfirm={handleSubmit}
            onHide={() => navigate(".", { replace: true, state: { removeSegment: "" } })}
            show={Boolean(location.state?.removeSegment)}
        />
    );
}
