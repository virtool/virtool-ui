import React from "react";
import { connect } from "react-redux";
import { SidebarHeader, SideBarSection } from "../../../base";
import { getReadySubtractionShortlist } from "../../../subtraction/selectors";
import { SampleSidebarList } from "./List";
import { SampleSidebarSelector } from "./Selector";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fontWeight, getColor, getFontSize } from "../../../app/theme";

const SubtractionInner = ({ name }) => name;

const SampleSubtractionFooter = styled.div`
    display: flex;
    color: ${props => getColor({ theme: props.theme, color: "greyDarkest" })};
    a {
        margin-left: 20px;
        font-size: ${getFontSize("md")};
        font-weight: ${fontWeight.thick};
    }
`;

export const DefaultSubtractions = ({ defaultSubtractions, subtractionOptions, onUpdate }) => (
    <SideBarSection>
        <SidebarHeader>
            Default Subtractions
            <SampleSidebarSelector
                render={({ name }) => <SubtractionInner name={name} />}
                sampleItems={subtractionOptions}
                selectedItems={defaultSubtractions}
                onUpdate={onUpdate}
                selectionType="default subtractions"
                manageLink={"/lol"}
            />
        </SidebarHeader>
        <SampleSidebarList
            items={subtractionOptions.filter(subtraction => defaultSubtractions.includes(subtraction.id))}
        />
        {Boolean(subtractionOptions.length) || (
            <SampleSubtractionFooter>
                No subtractions found <Link to="/subtractions">Create one</Link>.
            </SampleSubtractionFooter>
        )}
    </SideBarSection>
);

export const mapStateToProps = state => ({
    subtractionOptions: getReadySubtractionShortlist(state)
});

export default connect(mapStateToProps)(DefaultSubtractions);
