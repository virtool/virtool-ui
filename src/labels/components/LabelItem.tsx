import BoxGroupSection from "@base/BoxGroupSection";
import SampleLabel from "@samples/components/Label/SampleLabel";
import styled from "styled-components";
import { EditLabel } from "./EditLabel";
import { DeleteLabel } from "./RemoveLabel";

const LabelItemButtons = styled.div`
    align-items: center;
    background-color: transparent;
    display: flex;
    font-size: 17px;
    padding-right: 15px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;

    *:not(:first-child) {
        margin-left: 5px;
    }
`;

type ItemProps = {
    name: string;
    color: string;
    description: string;
    id: number;
};

/**
 * A condensed label item for use in a list of labels
 */
export function LabelItem({ name, color, description, id }: ItemProps) {
    return (
        <BoxGroupSection className="flex items-center">
            <div className="min-w-1/3">
                <SampleLabel name={name} color={color} />
            </div>
            {description}
            <LabelItemButtons>
                <EditLabel
                    id={id}
                    color={color}
                    description={description}
                    name={name}
                />
                <DeleteLabel id={id} name={name} />
            </LabelItemButtons>
        </BoxGroupSection>
    );
}
