import { fontWeight, getColor, getFontSize, getFontWeight } from "@app/theme";
import InputGroup from '@base/InputGroup';
import InputLabel from '@base/InputLabel';
import Select from '@base/Select';
import SelectButton from '@base/SelectButton';
import SelectContent from '@base/SelectContent';
import SelectItem from '@base/SelectItem';
import Link from '@base/Link';
import Box from "@base/Box";
import Icon from "@base/Icon";
import { OTUSegment } from "@otus/types";
import * as RadixSelect from "@radix-ui/react-select";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";

const SegmentSelectContainer = styled.div`
    display: flex;
    flex-direction: column;

    button {
        flex-grow: 1;
        padding: 10px 10px;
    }
`;

const NoSchema = styled(Box)`
    align-items: center;
    display: flex;
    justify-content: space-between;

    a,
    h5 {
        font-weight: ${fontWeight.thick};
    }

    h5 {
        margin: 0 0 5px;
    }

    p {
        margin: 0;
    }
`;

type SequenceSegmentFieldProps = {
    /** Whether a schema exists for the selected OTU */
    hasSchema: boolean;
    otuId: string;
    refId: string;
    /** A list of unreferenced segments */
    segments: OTUSegment[];
};

const SequenceSegmentRequired = styled.span`
    align-items: center;
    display: flex;
    margin-left: auto;

    span {
        margin-left: 4px;
    }
`;

const StyledSelectItem = styled(RadixSelect.Item)`
    font-size: ${getFontSize("md")};
    font-weight: ${getFontWeight("thick")};
    padding: 5px 35px 5px 25px;
    position: relative;
    user-select: none;
    margin-bottom: 5px;
    text-transform: capitalize;

    &:hover {
        background-color: ${({ theme }) =>
            getColor({ color: "greyHover", theme })};
        border: 0;
    }
`;

const StyledSequenceSegment = styled.div`
    align-items: center;
    display: flex;
    font-weight: ${fontWeight.thick};
    width: 100%;
`;

type SequenceSegmentProps = {
    /** The name of the segment */
    name: string;
    /** Whether the segment is required */
    required: boolean;
};

/**
 * A condensed sequence segment for use in a list of segments
 */
function SequenceSegment({ name, required }: SequenceSegmentProps) {
    return (
        <StyledSelectItem value={name} key={name}>
            <RadixSelect.ItemText>
                <StyledSequenceSegment>
                    <span>{name}</span>

                    {required && (
                        <SequenceSegmentRequired>
                            <Icon name="exclamation-circle" />
                            <span>Required</span>
                        </SequenceSegmentRequired>
                    )}
                </StyledSequenceSegment>
            </RadixSelect.ItemText>
        </StyledSelectItem>
    );
}

/**
 * Displays a dropdown list of available segments in adding/editing dialogs or provides option to create schema
 */
export default function SequenceSegmentField({
    hasSchema,
    otuId,
    refId,
    segments,
}: SequenceSegmentFieldProps) {
    const { control, setValue } = useFormContext<{ segment: string }>();

    if (hasSchema) {
        const segmentOptions = segments.map((segment) => (
            <SequenceSegment
                key={segment.name}
                name={segment.name}
                required={segment.required}
            />
        ));

        return (
            <InputGroup>
                <InputLabel htmlFor="segment">Segment</InputLabel>
                <SegmentSelectContainer>
                    <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => {
                            const segmentExists = segments.some(
                                (segment) => segment.name === value,
                            );

                            if (value && !segmentExists) {
                                setValue("segment", null);
                            }

                            return (
                                <Select
                                    value={value || "None"}
                                    onValueChange={(value) =>
                                        value !== "" &&
                                        onChange(
                                            value === "None" ? null : value,
                                        )
                                    }
                                >
                                    <SelectButton icon="chevron-down" />
                                    <SelectContent
                                        position="popper"
                                        align="start"
                                    >
                                        <SelectItem
                                            key="None"
                                            value="None"
                                            description=""
                                        >
                                            None
                                        </SelectItem>
                                        {segmentOptions}
                                    </SelectContent>
                                </Select>
                            );
                        }}
                        name="segment"
                    />
                </SegmentSelectContainer>
            </InputGroup>
        );
    }

    return (
        <InputGroup>
            <InputLabel>Segment</InputLabel>
            <NoSchema>
                <div>
                    <h5>No schema is defined for this OTU.</h5>
                    <p>
                        A schema defines the sequence segments that should be
                        present in isolates of the OTU.{" "}
                    </p>
                </div>
                <div>
                    <Link to={`/refs/${refId}/otus/${otuId}/schema`}>
                        Add a Schema
                    </Link>
                </div>
            </NoSchema>
        </InputGroup>
    );
}
