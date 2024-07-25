import { RemoveDialog } from "@base/RemoveDialog";
import { OTUQueryKeys, useUpdateOTU } from "@otus/queries";
import { OTUSegment } from "@otus/types";
import { useQueryClient } from "@tanstack/react-query";
import { reject } from "lodash-es";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";

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
    const history = useHistory();
    const location = useLocation<{ removeSegment: string }>();
    const mutation = useUpdateOTU();
    const queryClient = useQueryClient();

    const activeName = location.state?.removeSegment;

    function handleSubmit() {
        mutation.mutate(
            { otuId, name, abbreviation, schema: reject(schema, { name: activeName }) },
            {
                onSuccess: () => {
                    history.replace({ state: { removeSegment: "" } });
                    queryClient.invalidateQueries(OTUQueryKeys.detail(otuId));
                },
            }
        );
    }

    return (
        <RemoveDialog
            name={activeName}
            noun="Segment"
            onConfirm={handleSubmit}
            onHide={() => history.replace({ state: { removeSegment: "" } })}
            show={Boolean(location.state?.removeSegment)}
        />
    );
}
