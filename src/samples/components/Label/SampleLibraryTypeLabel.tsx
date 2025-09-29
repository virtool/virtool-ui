import Icon from "@base/Icon";
import { LibraryType } from "@samples/types";
import { getLibraryTypeDisplayName } from "@samples/utils";
import { BaseSampleLabel } from "./BaseSampleLabel";

type SampleLibraryTypeLabelProps = {
    /** The samples library type */
    libraryType: LibraryType;
};

/**
 * Displays the library type associated with the sample
 */
export default function SampleLibraryTypeLabel({
    libraryType,
}: SampleLibraryTypeLabelProps) {
    return (
        <BaseSampleLabel variant="library">
            <Icon name="dna" />
            <span>{getLibraryTypeDisplayName(libraryType)}</span>
        </BaseSampleLabel>
    );
}
