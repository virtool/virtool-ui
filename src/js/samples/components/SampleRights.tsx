import { useUpdateSettings } from "@administration/queries";
import { Settings } from "@administration/types";
import { InputGroup, InputLabel, InputSelect, SelectBox } from "@base";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import PseudoLabel from "@base/PseudoLabel";
import { includes, map } from "lodash-es";
import React from "react";
import styled from "styled-components";

const rights = [
    { label: "None", value: "" },
    { label: "Read", value: "r" },
    { label: "Read & write", value: "rw" },
];

export const SampleRightsGroup = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: ${(props) => props.theme.gap.column};
`;

type SampleRightsProps = {
    /** The settings data used for configuring sample rights */
    settings: Settings;
};

/**
 * A component managing sample settings, allowing users to configure sample rights
 */
export default function SampleRights({ settings }: SampleRightsProps) {
    const mutation = useUpdateSettings();

    const {
        sample_group,
        sample_group_read,
        sample_group_write,
        sample_all_read,
        sample_all_write,
    } = settings;

    const group =
        (sample_group_read ? "r" : "") + (sample_group_write ? "w" : "");
    const all = (sample_all_read ? "r" : "") + (sample_all_write ? "w" : "");

    const options = map(rights, (entry, index) => (
        <option key={index} value={entry.value}>
            {entry.label}
        </option>
    ));

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>Default Sample Rights</h2>
                <p>
                    Set the method used to assign groups to new samples and the
                    default rights.
                </p>
            </BoxGroupHeader>
            <BoxGroupSection>
                <PseudoLabel>Sample Group</PseudoLabel>
                <SampleRightsGroup>
                    <SelectBox
                        onClick={() =>
                            mutation.mutate({ sample_group: "none" })
                        }
                        active={sample_group === "none"}
                    >
                        <strong>None</strong>
                        <p>
                            Samples are assigned no group and only
                            <em> all {"users'"}</em> rights apply
                        </p>
                    </SelectBox>

                    <SelectBox
                        onClick={() =>
                            mutation.mutate({ sample_group: "force_choice" })
                        }
                        active={sample_group === "force_choice"}
                    >
                        <strong>Force choice</strong>
                        <p>
                            Samples are automatically assigned the creating
                            {"user's"} primary group
                        </p>
                    </SelectBox>

                    <SelectBox
                        onClick={() =>
                            mutation.mutate({
                                sample_group: "users_primary_group",
                            })
                        }
                        active={sample_group === "users_primary_group"}
                    >
                        <strong>{"User's"} primary group</strong>
                        <p>
                            Samples are assigned by the user in the creation
                            form
                        </p>
                    </SelectBox>
                </SampleRightsGroup>

                <InputGroup>
                    <InputLabel htmlFor="group">Group Rights</InputLabel>
                    <InputSelect
                        id="group"
                        value={group}
                        onChange={(e) =>
                            mutation.mutate({
                                sample_group_read: includes(
                                    e.target.value,
                                    "r",
                                ),
                                sample_group_write: includes(
                                    e.target.value,
                                    "w",
                                ),
                            })
                        }
                    >
                        {options}
                    </InputSelect>
                </InputGroup>

                <InputGroup>
                    <InputLabel htmlFor="all">All {"Users'"} Rights</InputLabel>
                    <InputSelect
                        id="all"
                        value={all}
                        onChange={(e) =>
                            mutation.mutate({
                                sample_all_read: includes(e.target.value, "r"),
                                sample_all_write: includes(e.target.value, "w"),
                            })
                        }
                    >
                        {options}
                    </InputSelect>
                </InputGroup>
            </BoxGroupSection>
        </BoxGroup>
    );
}
