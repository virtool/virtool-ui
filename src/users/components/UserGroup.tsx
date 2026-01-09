import Checkbox from "@base/Checkbox";
import SelectBoxGroupSection from "@base/SelectBoxGroupSection";

type UserGroupTypes = {
    /** The group unique id */
    id: string | number;

    /** The group name */
    name: string;

    /** Whether the group is selected */
    toggled: boolean;

    /** A callback function to handle the selection of a group */
    onClick: (id: string | number) => void;
};

/**
 * A condensed user group for use in a list of user groups
 */
export function UserGroup({ id, name, toggled, onClick }: UserGroupTypes) {
    return (
        <SelectBoxGroupSection
            active={toggled}
            onClick={() => onClick(id)}
            className="capitalize select-none"
        >
            <Checkbox
                checked={toggled}
                id={`UserGroupCheckbox-${id}`}
                label={name}
            />
        </SelectBoxGroupSection>
    );
}
