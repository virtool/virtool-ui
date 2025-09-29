import Button from "@/base/Button";
import { useDialogParam, usePathParams } from "@app/hooks";
import BoxGroup from "@base/BoxGroup";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import { useFetchOTU, useUpdateOTU } from "@otus/queries";
import { OtuSegment } from "@otus/types";
import { ReferenceRight, useCheckReferenceRight } from "@references/hooks";
import { map } from "lodash";
import AddSegment from "./AddSegment";
import EditSegment from "./EditSegment";
import RemoveSegment from "./RemoveSegment";
import Segment from "./Segment";

/**
 * Displays a component allowing users to manage the otu schema
 */
export default function Schema() {
    const { refId, otuId } = usePathParams<{ otuId: string; refId: string }>();
    const { hasPermission: canModify, isPending: isPendingPermission } =
        useCheckReferenceRight(refId, ReferenceRight.modify_otu);

    const { setOpen: setOpenAddSegment } = useDialogParam("openAddSegment");

    const { data, isPending } = useFetchOTU(otuId);
    const mutation = useUpdateOTU(otuId);

    if (isPending || isPendingPermission) {
        return <LoadingPlaceholder />;
    }

    const { abbreviation, name, schema } = data;

    function handleMoveUp(index: number) {
        const updatedSchema = data.schema.slice();
        [updatedSchema[index], updatedSchema[index - 1]] = [
            updatedSchema[index - 1],
            updatedSchema[index],
        ];
        handleUpdate(updatedSchema);
    }

    function handleMoveDown(index: number) {
        const updatedSchema = data.schema.slice();
        [updatedSchema[index], updatedSchema[index + 1]] = [
            updatedSchema[index + 1],
            updatedSchema[index],
        ];
        handleUpdate(updatedSchema);
    }

    function handleUpdate(updatedSchema: OtuSegment[]) {
        mutation.mutate({ otuId, schema: updatedSchema });
    }

    return (
        <div>
            <div className="flex justify-end mb-3">
                {canModify && (
                    <Button
                        color="blue"
                        onClick={() => setOpenAddSegment(true)}
                    >
                        Add Segment
                    </Button>
                )}
            </div>
            {schema.length ? (
                <BoxGroup>
                    {map(schema, (segment, index) => (
                        <Segment
                            key={segment.name}
                            canModify={canModify}
                            segment={segment}
                            first={index === 0}
                            last={index === schema.length - 1}
                            onMoveUp={() => handleMoveUp(index)}
                            onMoveDown={() => handleMoveDown(index)}
                        />
                    ))}
                </BoxGroup>
            ) : (
                <NoneFoundBox noun="segments" />
            )}

            <AddSegment
                abbreviation={abbreviation}
                name={name}
                otuId={otuId}
                schema={schema}
            />
            <EditSegment
                abbreviation={abbreviation}
                name={name}
                otuId={otuId}
                schema={schema}
            />
            {schema.length ? (
                <RemoveSegment
                    abbreviation={abbreviation}
                    name={name}
                    otuId={otuId}
                    schema={schema}
                />
            ) : null}
        </div>
    );
}
