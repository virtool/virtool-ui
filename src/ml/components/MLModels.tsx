import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "@base/ViewHeaderTitleBadge";
import { map } from "lodash-es";
import { useFindModels } from "../queries";
import { MLModelMinimal } from "../types";
import { MlModel } from "./MlModel";

function renderRow({ created_at, name, latest_release, id }: MLModelMinimal) {
    return (
        <MlModel
            created_at={created_at}
            name={name}
            latest_release={latest_release}
            key={id}
        />
    );
}

/**
 * A list of MLModels
 *
 * @returns A list of MLModels
 */
export function MLModels() {
    const { data, isPending } = useFindModels();

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const models = data.items.length ? (
        map(data.items, renderRow)
    ) : (
        <NoneFoundBox noun={"machine learning models"} />
    );

    return (
        <ContainerNarrow>
            <ViewHeader title="ML Models">
                <ViewHeaderTitle>
                    ML Models{" "}
                    <ViewHeaderTitleBadge>
                        {data.items.length}
                    </ViewHeaderTitleBadge>
                </ViewHeaderTitle>
            </ViewHeader>
            {models}
        </ContainerNarrow>
    );
}
