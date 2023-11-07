import { xor } from "lodash-es";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { SidebarHeader, SideBarSection } from "../../../base";
import { useFetchLabels } from "../../../labels/hooks";
import { updateSearch } from "../../actions";
import { getLabelsFromURL } from "../../selectors";
import { LabelFilterItem } from "./LabelFilterItem";

export const LabelFilter = ({ initialLabels, onFind }) => {
    const [selected, setSelected] = useState(initialLabels);
    const { data: labels } = useFetchLabels();

    const handleClick = id => {
        setSelected(selected => xor(selected, [id]));
        onFind(xor(selected, [id]));
    };

    const labelComponents =
        labels && Array.isArray(labels)
            ? labels.map(label => (
                  <LabelFilterItem
                      key={label.id}
                      {...label}
                      pressed={selected.includes(label.id)}
                      onClick={handleClick}
                  />
              ))
            : null;

    return (
        <SideBarSection>
            <SidebarHeader>
                Labels <Link to="/samples/labels">Manage</Link>
            </SidebarHeader>
            {labelComponents}
        </SideBarSection>
    );
};

export const mapStateToProps = state => ({
    initialLabels: getLabelsFromURL(state),
});

export const mapDispatchToProps = dispatch => ({
    onFind: labels => {
        dispatch(updateSearch({ labels }));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(LabelFilter);
