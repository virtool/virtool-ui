import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import { useDialogParam, usePathParams } from "@app/hooks";
import IconButton from "@base/IconButton";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NotFound from "@base/NotFound";
import Table from "@base/Table";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderIcons from "@base/ViewHeaderIcons";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { Permission } from "@groups/types";
import { useFetchSubtraction } from "@subtraction/queries";
import { NucleotideComposition } from "@subtraction/types";
import numbro from "numbro";
import { SubtractionAttribution } from "../Attribution";
import EditSubtraction from "./EditSubtraction";
import RemoveSubtraction from "./RemoveSubtraction";
import SubtractionFiles from "./SubtractionFiles";

function calculateGc(nucleotides: NucleotideComposition) {
    return numbro(1 - nucleotides.a - nucleotides.t - nucleotides.n).format(
        "0.000",
    );
}

/**
 * The subtraction detailed view
 */
export default function SubtractionDetail() {
    const { subtractionId } = usePathParams<{ subtractionId: string }>();

    const { data, isPending, isError } = useFetchSubtraction(subtractionId);
    const { hasPermission: canModify } = useCheckAdminRoleOrPermission(
        Permission.modify_subtraction,
    );

    const { open: openRemoveSubtraction, setOpen: setOpenRemoveSubtraction } =
        useDialogParam("openRemoveSubtraction");
    const { open: openEditSubtraction, setOpen: setOpenEditSubtraction } =
        useDialogParam("openEditSubtraction");

    if (isError) {
        return <NotFound />;
    }

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    if (!data.ready) {
        return (
            <LoadingPlaceholder message="Subtraction is still being imported" />
        );
    }

    return (
        <>
            <ViewHeader title={data.name}>
                <ViewHeaderTitle>
                    {data.name}
                    {canModify && (
                        <ViewHeaderIcons>
                            <IconButton
                                name="pen"
                                color="grayDark"
                                tip="modify"
                                onClick={() => setOpenEditSubtraction(true)}
                            />
                            <IconButton
                                name="trash"
                                color="red"
                                tip="remove"
                                onClick={() => setOpenRemoveSubtraction(true)}
                            />
                        </ViewHeaderIcons>
                    )}
                </ViewHeaderTitle>
                {data.user ? (
                    <SubtractionAttribution
                        handle={data.user.handle}
                        time={data.created_at}
                    />
                ) : null}
            </ViewHeader>
            <Table>
                <tbody>
                    <tr>
                        <th>Nickname</th>
                        <td>{data.nickname}</td>
                    </tr>
                    <tr>
                        <th>File</th>
                        <td>{data.file.name || data.file.id}</td>
                    </tr>
                    <tr>
                        <th>Sequence Count</th>
                        <td>{data.count}</td>
                    </tr>
                    <tr>
                        <th>GC Estimate</th>
                        <td>{calculateGc(data.gc)}</td>
                    </tr>
                    <tr>
                        <th>Linked Samples</th>
                        <td>{data.linked_samples.length}</td>
                    </tr>
                </tbody>
            </Table>
            <SubtractionFiles files={data.files} />
            <EditSubtraction
                show={openEditSubtraction}
                onHide={() => setOpenEditSubtraction(false)}
                subtraction={data}
            />
            <RemoveSubtraction
                subtraction={data}
                show={openRemoveSubtraction}
                onHide={() => setOpenRemoveSubtraction(false)}
            />
        </>
    );
}
